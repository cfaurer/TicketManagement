var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ValidForSchema = new Schema({
    startDateTime: Date,
    endDateTime: Date});

var AliasSchema = new Schema({
    type: String,
    value: String});

var RelatedPartySchema = new Schema({
    href: {type: String, required: true},
    role: String,
    name: String,
    validFor: {startDateTime: Date, endDateTime: Date},
    alias: [AliasSchema],
    status: String});

var RelatedObjectSchema = new Schema({
    href: {type: String, required: true},
    involvement: {type: String, required: true}
});

var NoteSchema = new Schema({
    text: {type: String, required: true},
    date: Date,
    author: String});

var TicketSchema   = new Schema({
    href: String,
    correlationId: String,
    description: {type: String, required: true},
    severity: {type: String, required: true, default: 'minor'},
    type: {type: String, required: true},
    creationDate: {type: Date, default: Date.now},
    status: String,
    subStatus: String,
    statusChangeReason: String,
    statusChangeDate: Date,
    resolutionDate: Date,
    targetResolutionDate: Date,
    relatedObject: [RelatedObjectSchema],
    relatedParty: [RelatedPartySchema],
    note: [NoteSchema]
});

module.exports = mongoose.model('Ticket', TicketSchema);
