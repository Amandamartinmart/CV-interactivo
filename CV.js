const { createApp } = Vue

createApp({
  data() {
    return {
      // Índice del elemento actual en la timeline
      currentIndex: 0,

      // Mapa de Leaflet
      map: null,

      // Marcador actual en el mapa
      marker: null,

      // Nivel de zoom inicial y final
      zoomStart: 5,
      zoomEnd: 11,

      // Lista de etapas del CV (formación y experiencia)
      stages: [
        {
          title: "Grado en Ciencias Experimentales",
          years: "2014-2018",
          place: "Universidad Rey Juan Carlos",
          coords: [40.335536776981, -3.8770524802396302],
          type: "education"
        },
        {
          title: "Máster en Técnicas de Conservación de la Biodiversidad y Ecología",
          years: "2018-2019",
          place: "Universidad Rey Juan Carlos",
          coords: [40.335536776981, -3.8770524802396302],
          type: "education"
        },
        {
          title: "Becaria en LPS Grupo",
          years: "Marzo 2022 - Junio 2022",
          place: "URJC",
          coords: [40.36810315743225, -3.747219407892847],
          type: "work",
          description: "Auditorías de calidad: apoyo en el control y validación de proyectos de ingeniería de red"
        },
        {
          title: "Técnica de redes en Avatel",
          years: "Julio 2022 - Abril 2023",
          place: "Avatel",
          coords: [40.54709623322498, -3.612887859534786],
          type: "work",
          description: `- Generación de cartografía para el programa ÚNICO (QGIS)
- Representación de datos en visores web (CARTO)`
        },
        {
          title: "Consultora en Calidad del Dato en Nae",
          years: "Mayo 2023 - Actualidad",
          place: "Nae",
          coords: [40.426033147712175, -3.6874426171482013],
          type: "work",
          description: `- Gestión de inventario FTTH y calidad de datos
- Comercialización de hogares
- Tratamiento de incidencias de red
- Soporte técnico al cliente`
        },
        {
          title: "Máster en Sistemas de Información Geográfica y Teledetección",
          years: "2024 - 2025",
          place: "Universidad de Extremadura",
          coords: [39.480462696811266, -6.337808026962371],
          type: "education"
        }
      ]
    }
  },

  // Propiedades calculadas (se recalculan automáticamente)
  computed: {
    currentStage() {
      // Devuelve el elemento actual del CV según el índice
      return this.stages[this.currentIndex]
    }
  },

  mounted() {
    // Se ejecuta cuando el componente se monta en la página

    // Crear el mapa centrado en la primera etapa
    this.map = L.map("map").setView(this.currentStage.coords, this.zoomStart)

    // Añadir capa de mapa base (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    }).addTo(this.map)

    // Inicializar mapa con la primera posición
    this.updateMap(true)
  },

  methods: {
    // Devuelve el icono según el tipo de etapa
    getIcon(type) {
      if (type === "education") {
        return "fa-solid fa-graduation-cap"
      } else if (type === "work") {
        return "fa-solid fa-briefcase"
      }
      return "fa-solid fa-circle"
    },

    // Actualiza el mapa sin animación (o con animación si skipAnimation = false)
    updateMap(skipAnimation = false) {
      const stage = this.currentStage

      // Centra el mapa en la coordenada actual
      this.map.setView(stage.coords, this.zoomEnd, {
        animate: !skipAnimation,
        duration: 1
      })

      // Elimina el marcador anterior si existe
      if (this.marker) {
        this.marker.remove()
      }

      // Crear nuevo marcador
      this.marker = L.marker(stage.coords)
        .addTo(this.map)
        .bindPopup(`
          <div style="text-align:left;">
            <b>${stage.title}</b><br/>
            ${
              // Si es trabajo, muestra descripción
              stage.type === "work"
                ? `<div style="white-space:pre-line;">${stage.description}</div>`
                // Si es educación, no muestra texto extra (más limpio)
                : ``
            }
          </div>
        `)
        .openPopup()
    },

    // Cambia a una nueva etapa con animación (flyTo)
    travelTo(newIndex) {
      const end = this.stages[newIndex]

      // Actualiza el índice actual
      this.currentIndex = newIndex

      // Animación de vuelo hacia el nuevo punto
      this.map.flyTo(end.coords, this.zoomEnd, {
        duration: 2.5,
        easeLinearity: 0.2
      })

      // Espera a que termine la animación para actualizar el marcador
      setTimeout(() => {
        if (this.marker) {
          this.marker.remove()
        }

        this.marker = L.marker(end.coords)
          .addTo(this.map)
          .bindPopup(`
            <div style="text-align:left;">
              <b>${end.title}</b><br/>
              ${
                end.type === "work"
                  ? `<div style="white-space:pre-line;">${end.description}</div>`
                  : ``
              }
            </div>
          `)
          .openPopup()
      }, 500)
    },

    // Ir a la siguiente etapa
    next() {
      if (this.currentIndex < this.stages.length - 1) {
        this.travelTo(this.currentIndex + 1)
      }
    },

    // Ir a la etapa anterior
    prev() {
      if (this.currentIndex > 0) {
        this.travelTo(this.currentIndex - 1)
      }
    },

    // Ir directamente a una etapa concreta (click en timeline)
    goTo(index) {
      if (index !== this.currentIndex) {
        this.travelTo(index)
      }
    }
  }
}).mount("#app")