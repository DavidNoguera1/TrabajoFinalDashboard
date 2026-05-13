import mongoose, { Schema, Model } from 'mongoose';
import { IRecursoDocument } from '../models/recurso.model';

const recursoSchema = new Schema<IRecursoDocument>(
  {
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    tipo: { type: String, required: true },
    anio: { type: Number, required: true },
    disponibilidad: { type: Boolean, required: true }
  },
  {
    collection: 'recursos_biblioteca',
    timestamps: true
  }
);

const RecursoModel: Model<IRecursoDocument> = mongoose.models.Recurso || mongoose.model<IRecursoDocument>('Recurso', recursoSchema);

export default RecursoModel;
