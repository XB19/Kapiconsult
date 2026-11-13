// Petits éléments communs aux formulaires
export const FieldError = ({ errors, name }) =>
  errors?.[name] ? <div className="form-error">{errors[name]}</div> : null;

export const Flash = ({ success, error }) => (
  <>
    {success && <div className="alert alert-success">{success}</div>}
    {error && <div className="alert alert-error">{error}</div>}
  </>
);
