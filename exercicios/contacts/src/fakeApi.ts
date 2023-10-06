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
    return json({ message: "Não existe contato com id " + contactId }, { status: 404 });
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
  const contact = contacts.find((item) => item.id === contactId);
  if (!contact) {
    return json({ message: "Não existe contato com id " + contactId }, { status: 404 });
  }
  const errorMessage = validateContact(data);
  if (errorMessage) {
    return json({ message: errorMessage }, { status: 400 });
  }
  Object.assign(contact, data);
  setContacts(contacts);
  return json(contact);
}

export async function deleteContact(contactId: string): Promise<Response> {
  await delay(1000);
  setContacts(getContacts().filter((item) => item.id !== contactId));
  return json({});
}

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

function getContacts() {
  return JSON.parse(localStorage.getItem("contacts") || "[]") as Contact[];
}

function setContacts(contact: Contact[]) {
  contact.sort((a, b) => a.name.localeCompare(b.name));
  localStorage.setItem("contacts", JSON.stringify(contact));
}
