import mongoose from 'mongoose';

const gradeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true,
  },
  lastModified: {
    type: Date,
    required: true,
    default: Date.now
  }
});

gradeSchema.virtual("id").get(function(){
  return this._id.toHexString();
});
gradeSchema.set("toJSON",{virtuals:true});

const gradeModel = mongoose.model('grade', gradeSchema, 'grades');

export default gradeModel;