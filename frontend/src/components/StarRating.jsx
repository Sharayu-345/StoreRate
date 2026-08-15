export default function StarRating({ value = 0, onChange, readOnly = false, size = 'text-lg' }) {
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className={`flex gap-0.5 ${size}`}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange && onChange(star)}
          className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform ${
            star <= Math.round(value) ? 'text-amber-500' : 'text-slate-300'
          }`}
          aria-label={`${star} star`}
        >
          ★
        </button>
      ))}
    </div>
  )
}