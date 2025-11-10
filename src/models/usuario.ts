//crear un modelo usuario con los atributos id, username, gmail, password y bithrday
import mongoose, { Schema, model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

// interfaz
export interface IUsuario {
    _id: Types.ObjectId;
    username: string;
    gmail: string;
    password: string;
    birthday: Date;
    role: 'user' | 'admin'; // 👈 añadimos esto
    comparePassword(candidatePassword: string): Promise<boolean>;
    isModified(path: string): boolean;
  }
  
  // esquema
  const usuarioSchema = new Schema<IUsuario>({
    username: { type: String, required: true, unique: true },
    gmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthday: { type: Date, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // 👈 añadido
  }, {
    timestamps: false,
    versionKey: false
  });



//encriptar la contraseña antes de guardarla en la base de datos HOOK DE MONGOOSE
usuarioSchema.pre<IUsuario>('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt();    
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
});



//método para comparar la contraseña ingresada con la contraseña encriptada en la base de datos
usuarioSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};



//guardamos en una variable exportable el modelo usuario, tiene similitud cuando en DSA llamabamos a una clase(objeto)
//ya que el funcionamiento es similar.
export const Usuario = model<IUsuario>('Usuario', usuarioSchema);
//exporto el modelo usuario
export default Usuario;

