export default function ProfileCard() {
  return (
    <>
      <div className="detail">
        <label>Name</label>
        <input type="text" defaultValue="Admin User" />
      </div>

      <div className="detail">
        <label>Email</label>
        <input type="email" defaultValue="admin@example.com" />
      </div>

      <div className="detail">
        <label>Phone</label>
        <input type="text" defaultValue="+91 9876543210" />
      </div>

      <div className="detail">
        <label>Role</label>
        <input type="text" defaultValue="Property Analyst" />
      </div>

      <div className="button-group">
        <button className="edit-btn">Save Changes</button>
        <button className="logout-btn">Cancel</button>
      </div>
    </>
  );
}
