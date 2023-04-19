import * as L from 'leaflet';
import './leaflet-slider.css';

type SliderOptions = {
  size?: string;
  min?: number;
  max?: number;
  step?: number;
  id?: string;
  value?: number;
  collapsed?: boolean;
  title?: string;
  logo?: string;
  orientation?: 'horizontal' | 'vertical';
  increment?: boolean;
  getValue?: (value: number) => string;
  showValue?: boolean;
  syncSlider?: boolean;
} & L.ControlOptions

export class Slider extends L.Control {

  private _container!: HTMLElement;
  private _sliderLink!: HTMLElement;
  private _sliderValue?: HTMLElement;
  private _plus?: HTMLElement;
  private _minus?: HTMLElement;
  private _sliderContainer!: HTMLElement;
  private slider!: HTMLInputElement;
  private value = 0;
  public options: SliderOptions;

  constructor(f: ((value: string) => void) | null, options: SliderOptions = {}) {
    super(options);
    this.options = {
      size: '100px',
      position: 'topright',
      min: 0,
      max: 250,
      step: 1,
      id: 'slider',
      value: 50,
      collapsed: true,
      title: 'Leaflet Slider',
      logo: 'S',
      orientation: 'horizontal',
      increment: false,
      getValue: (value: number) => value.toString(),
      showValue: true,
      syncSlider: false,
      ...options,
    };

    if (typeof f === 'function') {
      this.update = f;
    } else {
      this.update = function(value: string) {
        console.log(value);
      };
    }
    if (typeof this.options.getValue !== 'function') {
      this.options.getValue = function(value: number) {
        return value.toString();
      };
    }
    if (this.options.orientation !== 'vertical') {
      this.options.orientation = 'horizontal';
    }
  }

  public update(value) {
    return value;
  }

  public onAdd() {
    this._initLayout();
    this.update(this.options.value + '');
    return this._container;
  }

  private _updateValue() {
    this.value = parseInt(this.slider.value);
    if (this.options.showValue && this._sliderValue) {
      this._sliderValue.innerHTML = this.options.getValue(this.value);
    }
    this.update(this.value.toString());
  }

  private _initLayout() {
    const className = 'leaflet-control-slider';
    this._container = L.DomUtil.create('div', className + ' ' + className + '-' + this.options.orientation);
    this._sliderLink = L.DomUtil.create('a', className + '-toggle', this._container);
    this._sliderLink.setAttribute('title', this.options.title);
    this._sliderLink.innerHTML = this.options.logo;

    if (this.options.showValue) {
      this._sliderValue = L.DomUtil.create('p', className + '-value', this._container);
      this._sliderValue.innerHTML = this.options.getValue(this.options.value);
    }

    if (this.options.increment) {
      this._plus = L.DomUtil.create('a', className + '-plus', this._container);
      this._plus.innerHTML = '+';
      L.DomEvent.on(this._plus, 'click', this._increment, this);
      L.DomUtil.addClass(this._container, 'leaflet-control-slider-incdec');
    }

    this._sliderContainer = L.DomUtil.create('div', 'leaflet-slider-container', this._container);
    this.slider = L.DomUtil.create('input', 'leaflet-slider', this._sliderContainer);
    if (this.options.orientation == 'vertical') {
      this.slider.setAttribute('orient', 'vertical');
    }
    this.slider.setAttribute('title', this.options.title);
    this.slider.setAttribute('id', this.options.id);
    this.slider.setAttribute('type', 'range');
    this.slider.setAttribute('min', this.options.min.toString());
    this.slider.setAttribute('max', this.options.max.toString());
    this.slider.setAttribute('step', this.options.step.toString());
    this.slider.setAttribute('value', this.options.value.toString());
    if (this.options.syncSlider) {
      L.DomEvent.on(this.slider, 'input', function() {
        this._updateValue();
      }, this);
    } else {
      L.DomEvent.on(this.slider, 'change', function() {
        this._updateValue();
      }, this);
    }

    if (this.options.increment) {
      this._minus = L.DomUtil.create('a', className + '-minus', this._container);
      this._minus.innerHTML = '-';
      L.DomEvent.on(this._minus, 'click', this._decrement, this);
    }

    if (this.options.showValue) {
      if (window.matchMedia('screen and (-webkit-min-device-pixel-ratio:0)').matches && this.options.orientation === 'vertical') {
        this.slider.style.width = `${parseInt(this.options.size, 10) - 36}px`;
        this._sliderContainer.style.height = `${parseInt(this.options.size, 10) - 36}px`;
      } else if (this.options.orientation === 'vertical') {
        this._sliderContainer.style.height = `${parseInt(this.options.size, 10) - 36}px`;
      } else {
        this._sliderContainer.style.width = `${parseInt(this.options.size, 10) - 56}px`;
      }
    } else {
      if (window.matchMedia('screen and (-webkit-min-device-pixel-ratio:0)').matches && this.options.orientation === 'vertical') {
        this.slider.style.width = `${parseInt(this.options.size, 10) - 10}px`;
        this._sliderContainer.style.height = `${parseInt(this.options.size, 10) - 10}px`;
      } else if (this.options.orientation === 'vertical') {
        this._sliderContainer.style.height = `${parseInt(this.options.size, 10) - 10}px`;
      } else {
        this._sliderContainer.style.width = `${parseInt(this.options.size, 10) - 25}px`;
      }
    }

    L.DomEvent.disableClickPropagation(this._container);

    if (this.options.collapsed) {
      if (!L.Browser.android) {
        L.DomEvent
          .on(this._container, 'mouseenter', this._expand, this)
          .on(this._container, 'mouseleave', this._collapse, this);
      }

      if (L.Browser.touch) {
        L.DomEvent
          .on(this._sliderLink, 'click', L.DomEvent.stop)
          .on(this._sliderLink, 'click', this._expand, this);
      } else {
        L.DomEvent.on(this._sliderLink, 'focus', this._expand, this);
      }
    } else {
      this._expand();
    }
  }

  private _expand() {
    L.DomUtil.addClass(this._container, 'leaflet-control-slider-expanded');
  }

  private _collapse() {
    L.DomUtil.removeClass(this._container, 'leaflet-control-slider-expanded');
  }

  private _increment() {
    // console.log(this.slider.value-this.slider.step + " " + this.slider.value+this.slider.step);
    this.value = this.value + this.options.step;
    this._updateValue();
  }

  private _decrement() {
    // console.log(this.slider.value-this.slider.step + " " + this.slider.value+this.slider.step);
    this.value = this.value - this.options.step;
    this._updateValue();
  }
}