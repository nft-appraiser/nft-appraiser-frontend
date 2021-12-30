import React from "react";
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.css';

const SERVER = "http://0.0.0.0:8000/task/";


class App extends React.Component {
	constructor(props) {
		console.log("initialization", props);
		super(props);
		this.state = {
			message: props.message,
		};
	}

	getCSRFtoken() {
		for (let c of document.cookie.split(";")) {
			let cArray = c.split("=");
			if (cArray[0] === "csrftoken") return cArray[1];
		}
	}

	submitData() {
		this.setState({ predict: "now loading..." })
		console.log("sent", this.state);
		fetch(SERVER + "res/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": this.getCSRFtoken(),
			},
			body: JSON.stringify({
				image: this.state.image, 
				address: document.getElementById("address").value,
				token_id: document.getElementById("token_id").value,
			})
		})
		.then((res) => res.json())
		.then((res) => {
			console.log("receive", res);
			this.setState({ image: res.image, predict: res.predict, task: res.task });
			this.render();
		});
	}

	SaveImage(e) {
		const files = e.target.files
		console.log("save image", this.state);

		if (files.length > 0) {
			var file = files[0]
			var reader = new FileReader()
			reader.onload = (e) => {
				this.setState({ image: e.target.result })
			};
			reader.readAsDataURL(file);
			this.render();
		}
	}

	ResetData() {
		console.log("reset data", this.state);
		this.setState({ image: null, predict: null });
		document.getElementById("address").value = null;
		document.getElementById("token_id").value = null;
	}

	renderDropzone() {
		return (
			<body>
			<h1>Predict NFT price in the future</h1>
			    <div>
			      <label for="address">asset contract address</label><br />
			      <input type="text" id="address" /><br />
		            </div>
			    <div>
			      <label for="token_id">token id</label><br />
			      <input type="text" id="token_id" /><br />
			    </div>
			    <div>
			    </div>

			  <h1>Predict new NFT price</h1>
			  <div>
			    <input type="file" accept="image/jpg,image/jpeg,image/png" onChange={(e) => this.SaveImage(e)} /><br /><br />
			    <input type="button" id="btn" value="predict" onClick={() => this.submitData()}></input>
			    <input type="button" id="reset" value="reset" onClick={() => this.ResetData()}></input>
			  </div>
			</body>
		);
	}

	render() {
		return (
			<>
			<div>
			<div className="task_Form">{this.renderDropzone()}</div>
			<div className="image-element">
			{this.state.image ? <img src={this.state.image} alt="Image" /> : ""}
			<p>result</p>
			<p>{this.state.predict}</p>
			</div>
			</div>
			</>
		);
	}
}

ReactDOM.render(
	<React.StrictMode>
	<App message={"output result"}/>
	</React.StrictMode>,
	document.getElementById("root")
);
