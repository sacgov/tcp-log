const {parse} = require('./parser');

let sampleMessages = [
    parse("2A2A420000086801906920353800004024022812121401E01ED60869FD900601030C34392E3230372E372E3138330414564C543B303030303B46494E444D5942494B453B2323"),
    parse("3A3A2B0004086801906920353800062018021C0C0130000000000000000000000031000006000000002A00009A7E0105000000000002050000000000100404008000110600000000000012235213D459185B4147607F3D4E38F1496C17F891799952480C68E171F8493F89C5A846CF2323")

]

for (let i =0;i<6;i++) {
    sampleMessages = [...sampleMessages, ...sampleMessages]

}

module.exports = {
    sampleMessages
}