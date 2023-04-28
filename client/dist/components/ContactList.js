"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const core_1 = require("@material-ui/core");
const icons_1 = require("@material-ui/icons");
const ContactList = ({ state }) => (react_1.default.createElement(core_1.List, null, state.contacts.map((value) => {
    return (react_1.default.createElement(core_1.ListItem, { key: value, button: true, onClick: () => state.showContact(value._id, value.name, value.email) },
        react_1.default.createElement(core_1.ListItemAvatar, null,
            react_1.default.createElement(core_1.Avatar, null,
                react_1.default.createElement(icons_1.Person, null))),
        react_1.default.createElement(core_1.ListItemText, { primary: `${value.name}` })));
})));
exports.default = ContactList;
//# sourceMappingURL=ContactList.js.map