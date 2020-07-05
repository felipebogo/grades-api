import { db } from '../models/index.js';
import { logger } from '../config/logger.js';
import fs from 'fs';

const importGrades = async (_req, res) => {
  try {
    const { readFile } = fs.promises;
    const data = await readFile('./grades.csv','utf8');
    const dataArray = data.split(/\r?\n/);
    dataArray.splice(0,1);
    const dataJson = dataArray.map(data=>{
      const colsArray = data.split(',');
      const [name,subject,type,value,lastModified] = colsArray;
      return {name,subject,type,value,lastModified:new Date(lastModified)};  
    });
    await db.gradeModel.deleteMany();
    await db.gradeModel.insertMany(dataJson);
    res.send("Importado com sucesso");

  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Algum erro ocorreu ao salvar' });
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
  }
};
const create = async (req, res) => {
  try {
    const grade = new db.gradeModel(req.body);
    const result = await grade.save();
    res.send(result);
    logger.info(`POST /grade - ${JSON.stringify()}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Algum erro ocorreu ao salvar' });
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
  }
};

const findAll = async (req, res) => {
  const name = req.query.name;

  //condicao para o filtro no findAll
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};

  try {
    const result = await db.gradeModel.find(condition);
    console.log(result);
    res.send(result);
    logger.info(`GET /grade`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Erro ao listar todos os documentos' });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await db.gradeModel.findById(id);
    res.send(result);

    logger.info(`GET /grade - ${id}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar o Grade id: ' + id });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Dados para atualizacao vazio',
    });

  }

  const id = req.params.id;

  try {
    const grade = { ...req.body, lastModified: Date.now() };

    await db.gradeModel.findByIdAndUpdate(id, grade,
      { new: true, useFindAndModify: false });

    res.send({ message: 'Grade atualizado com sucesso' });

    logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar a Grade id: ' + id });
    logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await db.gradeModel.findByIdAndDelete(req.params.id);
    res.send({ message: 'Grade excluido com sucesso' });

    logger.info(`DELETE /grade - ${id}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Nao foi possivel deletar o Grade id: ' + id });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

const removeAll = async (req, res) => {
  try {
    await db.gradeModel.deleteMany();
    res.send({
      message: `Grades excluidos`,
    });
    logger.info(`DELETE /grade`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao excluir todos as Grades' });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

export default { importGrades, create, findAll, findOne, update, remove, removeAll };
