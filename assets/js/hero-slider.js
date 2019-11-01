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
		this.loop = this.hasAttribute( 'loop' );
		this.translucent = this.hasAttribute( 'translucent' );
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
		const container = document.createElement( 'section' );
		const title = document.createElement( 'slot' );
		const slides = document.createElement( 'slot' );
		
		// Cache these elements for future interaction.
		this.div = document.createElement( 'div' );
		this.prev = document.createElement( 'button' );
		this.next = document.createElement( 'button' );
		
		this.prev.className = 'prev';
		this.prev.textContent = '⇠ Previous';

		if ( ! this.loop ) {
			this.prev.classList.add( 'inactive' );
			this.prev.setAttribute( 'name', 'prev' );
			this.prev.setAttribute( 'aria-disabled', 'true' );
			this.prev.setAttribute( 'disabled', '' );
		}

		this.next.className = 'next';
		this.next.setAttribute( 'name', 'next' );
		this.next.setAttribute( 'aria-disabled', 'false' );
		this.next.textContent = 'Next ⇢';
		
		container.className = 'hero-slider';
		this.div.className = 'slides';
		if ( this.translucent ) this.div.classList.add( 'translucent' );

		title.setAttribute( 'id', 'hero-title' );
		title.setAttribute( 'name', 'title' );
		slides.setAttribute( 'id', 'slides' );
		slides.setAttribute( 'name', 'slides' );

		style.textContent = this.generateStyles();

		this.div.appendChild( slides );
		container.appendChild( title );
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
			this.goNext();
		} else {
			this.goPrev();
		}
		
		// Loop slides when reaching the beginning/end.
		if ( 0 > this.currentSlide ) {
			this.currentSlide = this.totalSlides - 1;
		}
		if ( this.currentSlide === this.totalSlides ) {
			this.currentSlide = 0;
		}

		console.log( this.currentSlide );

		// Move the slides according to currently active slide.
		this.div.style = `transform: translateX(-${ this.currentSlide * 100 }%)`;
	}

	goPrev() {
		this.currentSlide --;

		if ( ! this.loop ) {
			this.next.classList.remove( 'inactive' );
			this.next.setAttribute( 'aria-disabled', 'false' );
			this.next.removeAttribute( 'disabled' );

			if ( this.currentSlide === 0 ) {
				this.prev.classList.add( 'inactive' );
				this.prev.setAttribute( 'aria-disabled', 'true' );
				this.prev.setAttribute( 'disabled', '' );
			}
		}
	}

	goNext() {
		this.currentSlide ++;

		if ( ! this.loop ) {
			this.prev.classList.remove( 'inactive' );
			this.prev.setAttribute( 'aria-disabled', 'false' );
			this.prev.removeAttribute( 'disabled' );

			if ( this.currentSlide === this.totalSlides - 1 ) {
				this.next.classList.add( 'inactive' );
				this.next.setAttribute( 'aria-disabled', 'true' );
				this.next.setAttribute( 'disabled', '' );
			}
		}
	}

	generateStyles() {
		return `
.hero-slider {
	height: 100vh;
	margin: 0;
	overflow: hidden;
	padding: 0;
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

.translucent {
	opacity: 0.75;
}

::slotted(.content) {
	left: 50%;
	margin: 0;
	position: absolute;
	top: 50%;
	transform: translate(-50%, -50%);
	z-index: 1;
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
