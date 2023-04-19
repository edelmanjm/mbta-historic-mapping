import * as L from 'leaflet';

type TextboxOptions = {
  text?: string;
} & L.ControlOptions
export class Textbox extends L.Control {

  private text: string;

  constructor(options: TextboxOptions) {
    super(options);
    this.text = options.text == null ? "No overlay loaded" : options.text;
  }

  public onAdd(map) {
    const text = L.DomUtil.create('div');
    text.id = 'info_text';
    text.innerHTML = `<contenteditable="true">${this.text}</>`;
    return text;
  }

  public onRemove(map) {
    // Nothing to do here
  }
}