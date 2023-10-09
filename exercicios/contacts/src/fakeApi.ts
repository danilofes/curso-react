import { json } from "react-router-dom";

export interface ContactData {
  name: string;
  phone: string;
}

export interface Contact extends ContactData {
  id: string;
}

export interface ErrorData {
  message: string;
}

export async function listContacts(): Promise<Response> {
  await delay(1000);
  return json(getContacts());
}

export async function retrieveContact(contactId: string): Promise<Response> {
  await delay(1000);
  const contact = getContacts().find((item) => item.id === contactId);
  if (!contact) {
    throw json({ message: "Não existe contato com id " + contactId }, { status: 404 });
  }
  return json(contact);
}

export async function createContact(data: ContactData): Promise<Response> {
  await delay(1000);
  const errorMessage = validateContact(data);
  if (errorMessage) {
    return json({ message: errorMessage }, { status: 400 });
  }
  const newContact = { id: new Date().getTime().toString(), ...data };
  setContacts([...getContacts(), newContact]);
  return json(newContact);
}

export async function updateContact(contactId: string, data: ContactData): Promise<Response> {
  await delay(1000);
  const contacts = getContacts();
  const idx = contacts.findIndex((item) => item.id === contactId);
  if (idx === -1) {
    return json({ message: "Não existe contato com id " + contactId }, { status: 404 });
  }
  const errorMessage = validateContact(data);
  if (errorMessage) {
    return json({ message: errorMessage }, { status: 400 });
  }
  const updatedContacts = [...contacts];
  const updatedContact = Object.assign({ ...contacts[idx] }, data);
  updatedContacts[idx] = updatedContact;
  setContacts(updatedContacts);
  return json(updatedContact);
}

export async function deleteContact(contactId: string): Promise<Response> {
  await delay(1000);
  setContacts(getContacts().filter((item) => item.id !== contactId));
  return json({});
}

const api = {
  listContacts,
  retrieveContact,
  createContact,
  updateContact,
  deleteContact,
};

export default api;

function validateContact(data: ContactData) {
  if (!data.name) {
    return "Preencha o campo nome";
  }
  if (!data.phone) {
    return "Preencha o campo telefone";
  }
  return "";
}

function delay(delayMs: number) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

const initialData: Contact[] = [
  { id: "1", name: "Danilo", phone: "11111111" },
  { id: "11", name: "Duílio", phone: "11111111" },
  { id: "7", name: "Júlio", phone: "77777777" },
  { id: "9", name: "Leandro", phone: "99999999" },
  { id: "5", name: "Magno", phone: "55555555" },
  { id: "10", name: "Maurício", phone: "00000000" },
  { id: "3", name: "Odilon", phone: "33333333" },
  { id: "2", name: "Pablo", phone: "22222222" },
  { id: "8", name: "Pedro", phone: "88888888" },
  { id: "4", name: "Renan", phone: "44444444" },
  { id: "6", name: "Tiago", phone: "66666666" },
];

function getContacts(): Contact[] {
  const storedString = localStorage.getItem("contacts");
  if (storedString) {
    return JSON.parse(storedString);
  } else {
    return initialData;
  }
}

function setContacts(contact: Contact[]) {
  contact.sort((a, b) => a.name.localeCompare(b.name));
  localStorage.setItem("contacts", JSON.stringify(contact));
}
