import type { ActionFunction, LoaderFunction } from "remix";
import { useActionData, redirect, json, useCatch, Link, Form } from "remix";

import { db } from "~/utils/db.server";
import { requireUserId, getUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return {};
};

function validatePlaceContent(content: string) {
  if (content.length < 3) {
    return `That description is too short`;
  }
}

function validatePlaceName(name: string) {
  if (name.length < 1) {
    return `That place's name is too short`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
    content: string | undefined;
  };
  fields?: {
    name: string;
    content: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const name = form.get("name");
  const content = form.get("content");
  if (typeof name !== "string" || typeof content !== "string") {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fieldErrors = {
    name: validatePlaceName(name),
    content: validatePlaceContent(content),
  };

  const fields = { name, content };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const place = await db.place.create({ data: { ...fields, userId } });
  return redirect(`/places/${place.id}`);
};

export default function NewPlaceRoute() {
  const actionData = useActionData<ActionData>();

  // const contentError = validatePlaceContent(state.content);

  return (
    <div>
      <p>Which new gem would you like to share?</p>
      <Form method="post">
        <div>
          <label>
            Name:{" "}
            <input
              type="text"
              defaultValue={actionData?.fields?.name}
              name="name"
              aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
              aria-errormessage={
                actionData?.fieldErrors?.name ? "name-error" : undefined
              }
            />
            {actionData?.fieldErrors?.name ? (
              <p className="form-validation-error" role="alert" id="name-error">
                {actionData.fieldErrors.name}
              </p>
            ) : null}
          </label>
        </div>
        <div>
          <label>
            Content:{" "}
            <textarea
              defaultValue={actionData?.fields?.content}
              name="content"
              aria-invalid={
                Boolean(actionData?.fieldErrors?.content) || undefined
              }
              aria-errormessage={
                actionData?.fieldErrors?.content ? "content-error" : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p
              className="form-validation-error"
              role="alert"
              id="content-error"
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          <button type="submit" className="button large">
            Add this place
          </button>
        </div>
      </Form>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 401) {
    return (
      <div className="error-container">
        <p>You must be logged in to add a place.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }
}

export function ErrorBoundary() {
  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}
