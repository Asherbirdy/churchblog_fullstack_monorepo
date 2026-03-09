export interface Vue3SignatureType {
  addWaterMark: (watermarkText: string)=> void;
  clear: ()=> void;
  fromDataURL: (dataURL: string)=> void;
  isEmpty: ()=> boolean;
  save: (type?: string)=> string | undefined;
  undo: ()=> void;
}