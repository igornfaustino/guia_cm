import React, { Component } from 'react';
import { Row, Col, Container, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import superagent from 'superagent'

import coffe from '../img/cafeteria.jpg';
import noImage from '../img/noImage.jpg';
import Mapa from '../components/Mapa.js'
import Comentarios from '../components/Comentarios'

import FormLocals from '../components/FormLocals.js';


const localStorageAuth = require('../util/localHostAuth.js');


class Local extends Component {
	constructor() {
		super();
		this.state = {
			modal: false,
			local: {},
			cometario: {},
			comentarios: []
		}
		this.toggle = this.toggle.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
		this.saveOnDatabase = this.saveOnDatabase.bind(this);
		this.saveCommentsOnDatabase = this.saveCommentsOnDatabase.bind(this);
		this.getLocalsFromDatabase = this.getLocalsFromDatabase.bind(this);
		this.getCommentsFromDatabase = this.getCommentsFromDatabase.bind(this);
		this.deleteFromDatabase = this.deleteFromDatabase.bind(this)
	}

	componentWillMount() {
		this.getLocalsFromDatabase();
		this.getCommentsFromDatabase();
	}

	getLocalsFromDatabase() {
		fetch('https://guia-cm.herokuapp.com/api/local/' + this.props.match.params.id, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			}
		}).then((response) => response.json()).then((json) => {
			this.setState({
				local: json
			});
		});
	}

	getCommentsFromDatabase = () => {
		fetch('https://guia-cm.herokuapp.com/api/comment/' + this.props.match.params.id, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			}
		}).then((response) => response.json()).then((json) => {
			this.setState({
				comentarios: json,
			});
		});
	}


	saveOnDatabase(local) {
		superagent.put('https://guia-cm.herokuapp.com/api/local')
			.set('Authorization', localStorage.getItem('admin'))
			.set('Content-Type', 'application/json')
			.send(local)
			.end((err, res) => {
				if (res.body.success) {
					let updatedLocal = this.state.local;
					updatedLocal.nome = local.nome;
					updatedLocal.descricao = local.descricao;
					updatedLocal.horario = local.horario;
					this.setState({
						local: updatedLocal
					})
					alert('SHOW')
				} else {
					alert('Falha ao realizar operação')
				}
			})
	}

	saveCommentsOnDatabase(comentario) {
		let user = localStorage.getItem('user');
		user = JSON.parse(user);
		let comment = {
			user: user.displayName,
			local: this.props.match.params.id,
			userImage: user.photoURL,
			comentario: comentario,
		}
		fetch('https://guia-cm.herokuapp.com/api/comment/' + this.state.local._id, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(comment)
		}).then((response) => response.json()).then((json) => {
			console.log(json)
			if (json.success) {
				alert("show");
				this.setState({
					comentarios: this.state.comentarios.concat(json.comment)
				})
			} else {
				alert("droga");
			}
		});
	}

	toggle() {
		this.setState({
			modal: !this.state.modal
		});
	}

	handleSubmit(local) {
		let _local = {
			_id: this.state.local._id,
			nome: local.nome,
			descricao: local.descricao,
			horario: local.horario,
		}
		this.saveOnDatabase(_local);
		this.toggle();
	}

	handleCommentSubmit(cometario) {
		this.saveCommentsOnDatabase(cometario);
	}

	handleDelete(comentario) {
		this.deleteFromDatabase(comentario);
	}

	deleteFromDatabase(deletedComment) {
		fetch('https://guia-cm.herokuapp.com/api/comment/' + deletedComment._id, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Authorization': localStorage.getItem('admin'),
			},
		}).then((response) => response.json()).then((json) => {
			if (json.success) {
				alert("show");
				let comentarios = this.state.comentarios;
				comentarios = comentarios.filter((comentario) => {
					if (comentario._id !== deletedComment._id) {
						return true;
					}
					return false;
				});
				this.setState({
					comentarios: comentarios,
				});
			} else {
				alert("droga");
			}
		});
	}

	render() {
		let editButton;
		if (localStorageAuth.thereIsAdim()) {
			editButton = <Button className="btn-lg large-space" color="primary" onClick={this.toggle}>Editar Local</Button>;
		}
		if (this.state.local.cordenadas == null) {
			return null;
		}
		return (
			<Container className="text-center">
				<h1 className="large-space" >{this.state.local.nome}</h1>
				<Row>
					<Col md="6">
						<img src={this.state.local.image || noImage} alt="Foto do local" className="figure-img img-fluid rounded"></img>
					</Col>
					<Col md="6">
						<Container className="margin">
							<p>{this.state.local.descricao}</p>
							<p>{this.state.local.endereco}</p>
							<p>{this.state.local.horario}</p>
							{/* <Button color="primary" size="lg" block disabled>Acessar site</Button> */}
						</Container>
					</Col>
				</Row>
				<div className="map-space">
					<hr className="large-space" />
					<h3 className="large-space">Como chegar</h3>
					<Container className="align-center large-space map">
						<Mapa coordenadas={this.state.local.cordenadas} />
					</Container>
				</div>
				<hr />
				{editButton}
				<Container>
					<Comentarios comentarios={this.state.comentarios} handleSubmit={this.handleCommentSubmit} delete={this.handleDelete}/>
				</Container>
				<Modal isOpen={this.state.modal} toggle={this.toggle} className="modal-lg">
					<ModalHeader toggle={this.toggle}>Editar Local</ModalHeader>
					<ModalBody>
						<FormLocals value={this.state.local} handleSubmit={this.handleSubmit} alter={true} />
					</ModalBody>
				</Modal>
			</Container>
		);
	}
}

export default Local;
