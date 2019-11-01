/**
 * Class definition for Hero Slider component.
 * The name of any custom element must be a string with at least one hyphen/dash.
 */
customElements.define( 'hero-slider', class extends HTMLElement {
	constructor() {
		super();

		// Attach shadow DOM.
		const shadowRoot = this.attachShadow( { mode: 'open' } );
		
		// Set initial state data.
		this.setInitialState();

		// Generate markup and attach event listeners.
		this.generateMarkup( shadowRoot );
		this.attachEventListeners();
	}

	/**
	 * A helper method to set any initial state properties/data the component needs.
	 */
	setInitialState() {
		this.totalSlides = this.querySelectorAll( 'img' ).length;
		this.currentSlide = 0;
	}

	/**
	 * Generate HTML for the component's shadow DOM.
	 * 
	 * This defines the base markup as well as any slots that can receive user-defined
	 * child elements.
	 * 
	 * @param {object} shadowDOM Shadow DOM attached to this component.
	 */
	generateMarkup( shadowDOM ) {
		const style = document.createElement( 'style' );
		const container = document.createElement( 'header' );
		const slides = document.createElement( 'slot' );
		
		// Cache these elements for future interaction.
		this.div = document.createElement( 'div' );
		this.prev = document.createElement( 'button' );
		this.next = document.createElement( 'button' );
		
		this.prev.className = 'prev inactive';
		this.prev.setAttribute( 'name', 'prev' );
		this.prev.setAttribute( 'aria-disabled', 'true' );
		this.prev.setAttribute( 'disabled', '' );
		this.prev.textContent = '⇠ Previous';
		this.next.className = 'next';
		this.next.setAttribute( 'name', 'next' );
		this.next.setAttribute( 'aria-disabled', 'false' );
		this.next.textContent = 'Next ⇢';
		
		container.className = 'hero-slider';
		this.div.className = 'slides';

		slides.setAttribute( 'id', 'slides' );
		slides.setAttribute( 'name', 'slides' );

		style.textContent = this.generateStyles();

		this.div.appendChild( slides );
		container.appendChild( this.prev );
		container.appendChild( this.next );
		container.appendChild( this.div );
		shadowDOM.appendChild( style );
		shadowDOM.appendChild( container );

	}

	/**
	 * Add any event listeners the component needs.
	 */
	attachEventListeners() {
		const buttons = Array.from( this.shadowRoot.querySelectorAll( 'button' ) );

		buttons.forEach( ( button ) => {
			button.addEventListener( 'click', this.handleClick.bind( this ), false );
		} );
	}

	/**
	 * Event handler for this component's prev/next buttons.
	 * Advances slides and sets properties for prev/next buttons.
	 * 
	 * @param {event} e Click event.
	 */
	handleClick( e ) {
		const button = e.currentTarget;
		const action = button.getAttribute( 'name' );

		if ( 'next' === action ) {
			this.currentSlide ++;
			this.prev.classList.remove( 'inactive' );
			this.prev.setAttribute( 'aria-disabled', 'false' );
			this.prev.removeAttribute( 'disabled' );

			if ( this.currentSlide === this.totalSlides - 1 ) {
				this.next.classList.add( 'inactive' );
				this.next.setAttribute( 'aria-disabled', 'true' );
				this.next.setAttribute( 'disabled', '' );
			}
		} else {
			this.currentSlide --;
			this.next.classList.remove( 'inactive' );
			this.next.setAttribute( 'aria-disabled', 'false' );
			this.next.removeAttribute( 'disabled' );

			if ( this.currentSlide === 0 ) {
				this.prev.classList.add( 'inactive' );
				this.prev.setAttribute( 'aria-disabled', 'true' );
				this.prev.setAttribute( 'disabled', '' );
			}
		}

		// Move the slides according to currently active slide.
		this.div.style = `transform: translateX(-${ this.currentSlide * 100 }%)`;
	}

	generateStyles() {
		return `
.hero-slider {
	height: 100vh;
	overflow: hidden;
	position: relative;
}

.slides {
	display: flex;
	height: 100%;
	overflow: visible;
	position: relative;
	transition: transform 0.5s ease-in-out;
}

.prev,
.next {
	background-color: rgba(255,255,255,0.75);
	border: none;
	border-radius: 0.1875rem;
	cursor: pointer;
	font-size: 1rem;
	padding: 1rem;
	position: absolute;
	top: 50%;
	transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
	transform: translateY(-50%);
	z-index: 1;
}

.prev:not(.inactive):focus,
.prev:not(.inactive):hover,
.next:not(.inactive):focus,
.next:not(.inactive):hover {
	background-color: white;
}

.prev.inactive,
.next.inactive {
	cursor: default;
	opacity: 0.25;
	pointer-events: none;
}

.prev {
	left: 1rem;
}

.next {
	right: 1rem;
}

::slotted(img) {
	display: block;
	height: 100%;
	object-fit: cover;
	width: 100%;
}
`;
	}
} );
