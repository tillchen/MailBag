import * as Contacts from "./Contacts";
import { config } from "./config";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";

export function createState(inParentComponent) {
  return {
    pleaseWaitVisible: false,
    mailboxes: [],
    contacts: [],
    messages: [],
    currentView: "welcome", // welcome, message, compose, contact, or contactAdd
    currentMailbox: null,
    messageID: null,
    messageDate: null,
    messageFrom: null,
    messageTo: null,
    messageSubject: null,
    messageBody: null,
    contactID: null,
    contactName: null,
    contactEmail: null,

    showHidePleaseWait: function (isVisible: boolean): void {
      this.setState({ pleaseWaitVisible: isVisible });
    }.bind(inParentComponent),

    addMailboxToList: function (inMailbox: IMAP.IMailbox): void {
      const cl: IMAP.IMailbox[] = this.state.mailboxes.slice(0); // copy list
      cl.push(inMailbox);
      this.setState({ mailboxes: cl });
    }.bind(inParentComponent),

    addContactToList: function (inContact: Contacts.IContact): void {
      const cl = this.state.contacts.slice(0);
      cl.push({
        _id: inContact._id,
        name: inContact.name,
        email: inContact.email,
      });
      this.setState({ contacts: cl });
    }.bind(inParentComponent),

    showComposeMessage: function (inType: string): void {
      switch (inType) {
        case "new":
          this.setState({
            currentView: "compose",
            messageTo: "",
            messageSubject: "",
            messageBody: "",
            messageFrom: config.userEmail,
          });
          break;

        case "reply":
          this.setState({
            currentView: "compose",
            messageTo: this.state.messageFrom,
            messageSubject: `Re: ${this.state.messageSubject}`,
            messageBody: `\n\n---- Original Message ----\n\n${this.state.messageBody}`,
            messageFrom: config.userEmail,
          });
          break;

        case "contact":
          this.setState({
            currentView: "compose",
            messageTo: this.state.contactEmail,
            messageSubject: "",
            messageBody: "",
            messageFrom: config.userEmail,
          });
          break;
      }
    }.bind(inParentComponent),

    showAddContact: function (): void {
      this.setState({
        currentView: "contactAdd",
        contactID: null,
        contactName: "",
        contactEmail: "",
      });
    }.bind(inParentComponent),

    sortContacts: function (): void {
      console.log("sort contacts");
      const cl = this.state.contacts.slice(0);
      cl.sort((a, b) => a.name.localeCompare(b.name));
      console.log(cl);
      this.setState({ contacts: cl });
    }.bind(inParentComponent),

    setCurrentMailbox: function (inPath: String): void {
      this.setState({ currentView: "welcome", currentMailbox: inPath });
      this.state.getMessages(inPath);
    }.bind(inParentComponent),

    getMessages: async function (inPath: string): Promise<void> {
      this.state.showHidePleaseWait(true);
      const imapWorker: IMAP.Worker = new IMAP.Worker();
      const messages: IMAP.IMessage[] = await imapWorker.listMessages(inPath);
      this.state.showHidePleaseWait(false);

      this.state.clearMessages();
      messages.forEach((inMessage: IMAP.IMessage) => {
        this.state.addMessageToList(inMessage);
      });
    }.bind(inParentComponent),

    clearMessages: function (): void {
      this.setState({ messages: [] });
    }.bind(inParentComponent),

    addMessageToList: function (inMessage: IMAP.IMessage): void {
      const cl = this.state.messages.slice(0);
      cl.push({
        id: inMessage.id,
        date: inMessage.date,
        from: inMessage.from,
        subject: inMessage.subject,
      });
      this.setState({ messages: cl });
    }.bind(inParentComponent),

    showContact: function (
      inID: string,
      inName: string,
      inEmail: string
    ): void {
      this.setState({
        currentView: "contact",
        contactID: inID,
        contactName: inName,
        contactEmail: inEmail,
      });
    }.bind(inParentComponent),

    fieldChangeHandler: function (inEvent: any): void {
      if (
        inEvent.target.id === "contactName" &&
        inEvent.target.value.length > 16
      ) {
        // max length
        return;
      }
      this.setState({ [inEvent.target.id]: inEvent.target.value });
    }.bind(inParentComponent),

    saveContact: async function (): Promise<void> {
      const cl = this.state.contacts.slice(0);
      this.state.showHidePleaseWait(true);
      const contactsWorker: Contacts.Worker = new Contacts.Worker();
      const contact: Contacts.IContact = await contactsWorker.addContact({
        name: this.state.contactName,
        email: this.state.contactEmail,
      });
      this.state.showHidePleaseWait(false);
      cl.push(contact);
      this.setState({
        contacts: cl,
        contactID: null,
        contactName: "",
        contactEmail: "",
      });
    }.bind(inParentComponent),

    deleteContact: async function (): Promise<void> {
      this.state.showHidePleaseWait(true);
      const contactsWorker: Contacts.Worker = new Contacts.Worker();
      await contactsWorker.deleteContact(this.state.contactID);
      this.state.showHidePleaseWait(false);
      const cl = this.state.contacts.filter(
        (inElement) => inElement._id != this.state.contactID
      );
      this.setState({
        contacts: cl,
        contactID: null,
        contactName: "",
        contactEmail: "",
      });
    }.bind(inParentComponent),

    updateContact: async function (): Promise<void> {
      this.state.showHidePleaseWait(true);
      const cl = this.state.contacts.filter(
        (inElement) => inElement._id != this.state.contactID
      );
      const contactsWorker: Contacts.Worker = new Contacts.Worker();
      const contact: Contacts.IContact = {
        _id: this.state.contactID,
        name: this.state.contactName,
        email: this.state.contactEmail,
      };
      await contactsWorker.updateContact(contact);
      cl.push(contact);
      this.setState({
        contacts: cl,
        contactID: null,
        contactName: "",
        contactEmail: "",
      });
      this.state.showHidePleaseWait(false);
    }.bind(inParentComponent),

    showMessage: async function (inMessage: IMAP.IMessage): Promise<void> {
      this.state.showHidePleaseWait(true);
      const imapWorker: IMAP.Worker = new IMAP.Worker();
      const mb: String = await imapWorker.getMessageBody(
        inMessage.id,
        this.state.currentMailbox
      );
      this.state.showHidePleaseWait(false);
      this.setState({
        currentView: "message",
        messageID: inMessage.id,
        messageDate: inMessage.date,
        messageFrom: inMessage.from,
        messageTo: "",
        messageSubject: inMessage.subject,
        messageBody: mb,
      });
    }.bind(inParentComponent),

    sendMessage: async function (): Promise<void> {
      this.state.showHidePleaseWait(true);
      const smtpWorker: SMTP.Worker = new SMTP.Worker();
      await smtpWorker.sendMessage(
        this.state.messageTo,
        this.state.messageFrom,
        this.state.messageSubject,
        this.state.messageBody
      );
      this.state.showHidePleaseWait(false);
      this.setState({ currentView: "welcome" });
    }.bind(inParentComponent),

    deleteMessage: async function (): Promise<void> {
      this.state.showHidePleaseWait(true);
      const imapWorker: IMAP.Worker = new IMAP.Worker();
      await imapWorker.deleteMessage(
        this.state.messageID,
        this.state.currentMailbox
      );
      this.state.showHidePleaseWait(false);
      const cl = this.state.messages.filter(
        (inElement) => inElement.id != this.state.messageID
      );
      this.setState({ messages: cl, currentView: "welcome" });
    }.bind(inParentComponent),
  };
}
