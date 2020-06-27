import React, { Fragment } from "react";
import { StyleSheet, Text, TouchableOpacity, TextInput } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input } from "react-native-elements";

export default class Initialization extends React.Component {
	constructor() {
		super();
		this.state = {
			user: false,
			business: false,
			userData: {
				name: null,
				surname: null,
			},
			businessData: {
				name: null,
				surname: null,
			},
		};
	}

	render() {
		let firstScreen = (
			<Fragment>
				<Text>Introductory text </Text>
				<Text>I am a: </Text>
				<TouchableOpacity
					style={styles.button}
					activeOpacity={0.7}
					onPress={() => {
						this.setState({ business: true });
					}}
				>
					<Text style={styles.buttonText}> Business </Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.button}
					activeOpacity={0.7}
					onPress={() => {
						this.setState({ user: true });
					}}
				>
					<Text style={styles.buttonText}> User </Text>
				</TouchableOpacity>
			</Fragment>
		);

		let userScreen = (
			<Fragment>
				<Text>Guide text</Text>
				<Text>Example data</Text>
				<Input
					placeholder="Name"
					leftIcon={{ type: "font-awesome", name: "comment" }}
					onChangeText={(value) => {
						this.setState((prevState) => ({
							userData: { ...prevState.userData, name: value },
						}));
					}}
				/>
				<Input
					placeholder="Surname"
					leftIcon={{ type: "font-awesome", name: "comment" }}
					onChangeText={(value) => {
						this.setState((prevState) => ({
							userData: { ...prevState.userData, surname: value },
						}));
					}}
				/>
				<TouchableOpacity
					style={styles.button}
					activeOpacity={0.7}
					onPress={() => {
						console.log(this.state.userData);
					}}
				>
					<Text style={styles.buttonText}> Submit </Text>
				</TouchableOpacity>
			</Fragment>
		);

		let businessScreen = (
			<Fragment>
				<Text>Guide text</Text>
				<Text>Example data</Text>
				<Input
					placeholder="Name"
					leftIcon={{ type: "font-awesome", name: "comment" }}
					onChangeText={(value) => {
						this.setState((prevState) => ({
							businessData: { ...prevState.businessData, name: value },
						}));
					}}
				/>
				<Input
					placeholder="Surname"
					leftIcon={{ type: "font-awesome", name: "comment" }}
					onChangeText={(value) => {
						this.setState((prevState) => ({
							businessData: { ...prevState.businessData, surname: value },
						}));
					}}
				/>
				<TouchableOpacity
					style={styles.button}
					activeOpacity={0.7}
					onPress={() => {
						console.log(this.state.businessData);
						console.log("user", this.state.user);
						console.log("business", this.state.business);
					}}
				>
					<Text style={styles.buttonText}> Submit </Text>
				</TouchableOpacity>
			</Fragment>
		);

		return this.state.user || this.state.business ? (
			this.state.business ? (
				businessScreen
			) : this.state.user ? (
				userScreen
			) : (
				<Text>Error</Text>
			)
		) : (
			firstScreen
		);
	}
}

const styles = StyleSheet.create({
	button: {
		width: "50%",
		paddingTop: 8,
		marginTop: 10,
		paddingBottom: 8,
		backgroundColor: "#1976d2",
		marginBottom: 20,
	},
	buttonText: {
		color: "#fff",
		textAlign: "center",
		fontSize: 18,
	},
});
