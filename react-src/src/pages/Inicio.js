import React, { Component } from 'react';

import CategoriaItem from '../components/CategoriaItem';
import Carrossel from '../components/Carrossel';
// import coffe from '../img/cafeteria.jpg';
// import atividade from '../img/atividade.jpg';
// import domingo from '../img/domingo.jpg';
// import sebo from '../img/sebo.jpg';
// import banco from '../img/dinheiro.jpg';
// import moveis from '../img/moveis.jpg';
// import mercado from '../img/mercado.jpg';
// import imobiliaria from '../img/imobiliaria.jpg';
// import farmacia from '../img/farmacia.jpg';

import { Row, Col, Container } from 'reactstrap';



// import {
// 	BrowserRouter as Router,
// 	Route,
// 	Link
// } from 'react-router-dom'

class Inicio extends Component {
	constructor() {
		super();
		this.state = {
			categories: [],
			indice: 0,
			tamanho: 6,
			v: [
				{
					nome: 'Subway',
					desc: 'Aberto todos os dias 11:00 - 23:30'
				},
				{
					nome: 'Academia Planeta Fitness',
					desc: 'De Segunda a Sexta 06:00-10:30 14:00-00:00'
				},
				{
					nome: 'Supermercado BomDia',
					desc: 'De Segunda a Sabado 08:30–20:30 e Domingo 08:30–13:00'
				}
			]
		}

		this.nextSlide = this.nextSlide.bind(this);
	}

	componentWillMount() {
		this.setState(
			{
				indice: 0,
				categories: [
					{
						nome: 'Atividades fisicas',
						img: require('../img/atividade.jpg')
					},
					{
						nome: 'Comer no Domingo',
						img: require('../img/domingo.jpg')
					},
					{
						nome: 'Imobiliária',
						img: require('../img/imobiliaria.jpg')
					},
					{
						nome: 'Sebo',
						img: require('../img/sebo.jpg')
					},
					{
						nome: 'Hospitais e Farmácias',
						img: require('../img/farmacia.jpg')
					},
					{
						nome: 'Banco',
						img: require('../img/dinheiro.jpg')
					},
					{
						nome: 'Moveis Usados',
						img: require('../img/moveis.jpg')
					},
					{
						nome: 'Mercados baratos',
						img: require('../img/mercado.jpg')
					}
				]
			});
	}

	nextSlide(indice) {
		this.setState({
			indice: indice,
		});
	}



	render() {
		let categoryItens;
		if (this.state.categories) {
			categoryItens = this.state.categories.map(category => {
				return (
					<CategoriaItem key={category.nome} category={category} link="/localidades/" />
				);
			});
		}

		return (
			<Container>
				<Row>
					<Col md="6">
						<Carrossel teste={this.nextSlide}>
						</Carrossel>
					</Col>
					<Col md="6">
						<h1>{this.state.v[this.state.indice].nome}</h1>
						{this.state.v[this.state.indice].desc}
					</Col>
				</Row>
				<hr className="large-space" />
				<Row>
					{categoryItens}
				</Row>
			</Container>
		);


	}
}

export default Inicio;
