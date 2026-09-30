import Icon from "../ui/Icons";
import { useFavorites, toggleFavorite } from "./favoritesStore";

export default function FavoriteButton({ dishId, name, className = "" }) {
  const { has } = useFavorites();
  const active = has(dishId);

  return (
    <button
      type="button"
      className={`fav-btn${active ? " fav-btn--active" : ""} ${className}`}
      onClick={() => toggleFavorite(dishId)}
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from favorites` : `Save ${name} to favorites`}
      title={active ? "Remove from favorites" : "Save to favorites"}
    >
      <Icon name="heart" filled={active} size={18} />
    </button>
  );
}