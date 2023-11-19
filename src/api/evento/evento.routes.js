const express = require('express');
const { isAdmin } = require("../../middleware/auth.js")
const eventoRoutes = express.Router();

const { getAllEventos,setEvento, deleteEvento, updateEvento, getEventoById, sendEventosSemanalesHandler, remindEventosHandler, sendEventosDiariosHandler, getEventosDesdeHoy, getEventosParaCalendar } = require('./evento.controller.js');
const { checkEventMandatoryFields } = require('../../middleware/checkfields.js');
const upload = require('../../middleware/img.js');

eventoRoutes.get('/', getAllEventos);
eventoRoutes.get('/eventosDesdeHoy', getEventosDesdeHoy);
eventoRoutes.get('/eventosParaCalendar', getEventosParaCalendar)
eventoRoutes.get("/getbyid/:idEvento", getEventoById)
eventoRoutes.put('/:idEvento', [isAdmin],upload.single("image"),updateEvento);
eventoRoutes.post('/', [isAdmin],upload.single("image"), setEvento);
eventoRoutes.get('/sendEventosSemanales', sendEventosSemanalesHandler);
eventoRoutes.get('/remindEvento', remindEventosHandler);
eventoRoutes.get('/sendEventosDiarios', sendEventosDiariosHandler);
eventoRoutes.delete('/:idEvento', [isAdmin],deleteEvento);

module.exports = eventoRoutes;