import { Link } from "react-router-dom";
import EmptyState from "../ui/EmptyState";
import Button from "../ui/Button";

export default function NotFound() {
  return (
    <main className="container page">
      <EmptyState
        icon="search"
        title="404 — page not found"
        message="That page seems to have been eaten. Try the menu instead."
        action={<Button as={Link} to="/">Back home</Button>}
      />
    </main>
  );
}