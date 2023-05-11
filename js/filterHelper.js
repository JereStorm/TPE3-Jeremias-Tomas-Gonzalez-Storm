class FilterHelper {


    constructor(nodeFilters) {
        this.nodeFilters = nodeFilters;
        this.styles = {
            selected: 'filtro-selected',
            disabled: 'disabled'
        }
    }

    cleanFiltersExcept(filterName = 'null') {
        for (let otherFiltro of this.nodeFilters) {
            if (otherFiltro.getAttribute('data-id') != filterName) {
                otherFiltro.classList.remove(this.styles.selected);
            }
        }
    }

    activateFilters() {
        for (let filtro of this.nodeFilters) {
            filtro.disabled = false;
            filtro.classList.remove(this.styles.disabled);
        }
    }
    desactivateFilters() {
        for (let filtro of this.nodeFilters) {
            filtro.disabled = true;
            filtro.classList.add(this.styles.disabled);
        }
    }



}