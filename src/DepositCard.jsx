export default function DepositCard({ setDisplay }) {
  return (
    <div
      className="card"
      onClick={() => {
        setDisplay("deposit");
      }}
    >
      <svg
        fill="#d59bf6"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="package-return">
          <path d="M18.5,3H5.5A2.503,2.503,0,0,0,3,5.5v13A2.5026,2.5026,0,0,0,5.5,21h7a.5.5,0,0,0,0-1h-7A1.5017,1.5017,0,0,1,4,18.5V5.5A1.5017,1.5017,0,0,1,5.5,4H9V9.5a.5.5,0,0,0,.5.5h5a.5.5,0,0,0,.5-.5V4h3.5A1.5017,1.5017,0,0,1,20,5.5v8a.5.5,0,0,0,1,0v-8A2.503,2.503,0,0,0,18.5,3ZM14,9H10V4h4Z" />

          <path d="M21,18.5a.5.5,0,0,1-.5.5H16.707l.6465.6465a.5.5,0,1,1-.707.707l-1.4994-1.4994a.5016.5016,0,0,1,0-.7082l1.4994-1.4994a.5.5,0,0,1,.707.707L16.707,18H20.5A.5.5,0,0,1,21,18.5Z" />
        </g>
      </svg>
      <p>DEPOSIT</p>
    </div>
  );
}
