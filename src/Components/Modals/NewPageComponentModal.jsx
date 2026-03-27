import ReactDOM from "react-dom/client";

export const openInNewWindowModal = ({Component}) => {
  const newWindow = window.open("", "", "width=800,height=600");
  if (!newWindow) return;

  const div = newWindow.document.createElement("div");
  newWindow.document.body.appendChild(div);

  const root = ReactDOM.createRoot(div);
  root.render(<Component />);
};
