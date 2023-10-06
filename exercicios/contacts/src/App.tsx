import {
  ActionFunction,
  Form,
  Link,
  Outlet,
  RouterProvider,
  createHashRouter,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteError,
  useRouteLoaderData,
} from "react-router-dom";
import {
  Contact,
  ContactData,
  ErrorData,
  createContact,
  deleteContact,
  listContacts,
  retrieveContact,
  updateContact,
} from "./fakeApi";

const updateAction: ActionFunction = async ({ params: { contactId }, request }) => {
  const formData = await request.formData();
  const contactData: ContactData = Object.fromEntries(formData) as any;
  const response = await updateContact(contactId!, contactData);
  if (response.ok) {
    return redirect(`/${contactId!}`);
  } else {
    return response;
  }
};

const createAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const contactData: ContactData = Object.fromEntries(formData) as any;
  const response = await createContact(contactData);
  if (response.ok) {
    const newContact = await response.json();
    return redirect(`/${newContact.id}`);
  } else {
    return response;
  }
};

const deleteAction: ActionFunction = async ({ params }) => {
  const response = await deleteContact(params.contactId!);
  if (response.ok) {
    return redirect("/");
  } else {
    throw response;
  }
};

const router = createHashRouter([
  {
    path: "/",
    element: <Contacts />,
    loader: () => listContacts(),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Index /> },
      {
        path: ":contactId",
        id: "contact",
        loader: ({ params: { contactId } }) => retrieveContact(contactId!),
        children: [
          { index: true, element: <ShowContact /> },
          { path: "update", element: <UpdateContact />, action: updateAction },
          { path: "delete", action: deleteAction },
        ],
      },
      { path: "create", element: <CreateContact />, action: createAction },
    ],
  },
]);

function Contacts() {
  const { state } = useNavigation();
  const contacts = useLoaderData() as Contact[];
  return (
    <div className="app">
      <nav>
        <h2>Contatos</h2>
        <ul>
          {contacts.map((contact) => (
            <li key={contact.id}>
              <Link to={`${contact.id}`}>{contact.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <main>{state === "loading" ? <p>Carregando...</p> : <Outlet />}</main>
    </div>
  );
}

function Index() {
  return (
    <p>
      Clique em um contato da lista para editar ou <Link to="create">Cadastre um novo</Link>.
    </p>
  );
}

function ShowContact() {
  const contact = useRouteLoaderData("contact") as Contact;
  const { state } = useNavigation();
  return (
    <div>
      <div>Id: {contact.id}</div>
      <div>Nome: {contact.name}</div>
      <div>Telefone: {contact.phone}</div>
      <div className="toolbar">
        <Link to="/">Fechar</Link>
        <Link to="update">Editar</Link>
        <Form className="inline" method="POST" action="delete">
          <button disabled={state === "submitting"}>
            {state === "submitting" ? "Excluindo..." : "Excluir"}
          </button>
        </Form>
      </div>
    </div>
  );
}

function CreateContact() {
  const { state } = useNavigation();
  return (
    <Form method="POST">
      <label>
        Nome: <input name="name" autoFocus />
      </label>
      <label>
        Telefone: <input name="phone" />
      </label>
      <div className="toolbar">
        <button disabled={state === "submitting"}>
          {state === "submitting" ? "Salvando..." : "Salvar"}
        </button>
        <Link to="/">Cancelar</Link>
      </div>
      <ActionErrorMessage />
    </Form>
  );
}

function UpdateContact() {
  const { state } = useNavigation();
  const contact = useRouteLoaderData("contact") as Contact;
  return (
    <Form method="POST">
      <div>Id: {contact.id}</div>
      <label>
        Nome: <input name="name" defaultValue={contact?.name} autoFocus />
      </label>
      <label>
        Telefone: <input name="phone" defaultValue={contact?.phone} />
      </label>
      <div className="toolbar">
        <button disabled={state === "submitting"}>
          {state === "submitting" ? "Salvando..." : "Salvar"}
        </button>
        <Link to={`/${contact.id}`}>Cancelar</Link>
      </div>
      <ActionErrorMessage />
    </Form>
  );
}

function ErrorPage() {
  const error = useRouteError() as any;
  return (
    <div className="app">
      <main>
        <p>Ocorreu um erro na aplicação.</p>
        <p>{error.data?.message || error.message}</p>
        <p>
          <Link to="/">Voltar para página inicial</Link>
        </p>
      </main>
    </div>
  );
}

function ActionErrorMessage() {
  const error = useActionData() as ErrorData | undefined;
  if (error) {
    return <div className="error">{error.message}</div>;
  } else {
    return null;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
