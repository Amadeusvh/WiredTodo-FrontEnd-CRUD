import React from "react";
import "./TodoPage.css";
import { Container, Row, Col } from "react-bootstrap";
import TodoList from "../components/TodoList";

const TodoPage = () => {

		return (
				<Container className="todoPage">
						<Row>
								<Col>
										{/*Titulo com o nome do APP*/}
										<h1 className="mb-5" id="title">Wired Todo</h1>
								</Col>
						</Row>
						<Row>
								{/*Chamando o componente para a pagina*/}
								<TodoList/>
						</Row>
				</Container>
		);
}

export default TodoPage;