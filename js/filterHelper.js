class FilterHelper {

    /**
     * This Class handler the sate of style from filters (HTMLCollection)
     * @param {HTMLCollection} nodeFilters 
     */
    constructor(nodeFilters) {
        this.nodeFilters = nodeFilters;
        this.styles = {
            selected: 'filtro-selected',
            disabled: 'disabled'
        }
    }

    /**
     * This Method remove the "selected" style if get param "filterName" of all filters except filterName,
     * else of all filters
     * @param {String | empty} filterName 
     */
    diselectedFiltersExcept(filterName = 'null') {
        for (let otherFiltro of this.nodeFilters) {
            if (otherFiltro.getAttribute('data-id') != filterName) {
                otherFiltro.classList.remove(this.styles.selected);
            }
        }
    }

    /**
     * This method activate filters set disabled in false and handling the "disabled" styles
     */
    activateFilters() {
        for (let filtro of this.nodeFilters) {
            filtro.disabled = false;
            filtro.classList.remove(this.styles.disabled);
        }
    }
    /**
        * This method activate filters set disabled in true and handling the "disabled" styles
        */
    desactivateFilters() {
        for (let filtro of this.nodeFilters) {
            filtro.disabled = true;
            filtro.classList.add(this.styles.disabled);
        }
    }



}