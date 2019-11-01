/**
 * Class definition for Hero Slider component.
 */
customElements.define( 'hero-slider', class extends HTMLElement {
	constructor() {
		super();

		// Attach shadow DOM.
		const shadowRoot = this.attachShadow( { mode: 'open' } );

		this.generateMarkup( shadowRoot );
		this.totalSlides = this.querySelectorAll( 'img' ).length;
		this.currentSlide = 0;
		this.attachEvents();
	}

	generateMarkup( shadowDOM ) {
		const style = document.createElement( 'style' );
		const container = document.createElement( 'header' );
		const slides = document.createElement( 'slot' );
		
		// Cache these elements for future interaction
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

	attachEvents() {
		const buttons = Array.from( this.shadowRoot.querySelectorAll( 'button' ) );

		buttons.forEach( ( button ) => {
			button.addEventListener( 'click', this.handleClick.bind( this ), false );
		} );
	}

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

		return css;
	}
} );
