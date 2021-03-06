import "./styles/index.scss";

import { Field, FieldProps, Form, Formik, FormikActions, FormikProps } from "formik";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect, Provider } from "react-redux";
import * as Yup from "yup";

import * as actions from "./actions/statistics";
import Help from "./components/help";
import Info from "./components/info";
import Statistics from "./components/statistics";
import Manager from "./manager";
import store from "./store";
import FormField from "./components/field";
import fieldDescriptions from "./utils/fields";

interface FormFieldInterface {
  label: string;
  description: string;
  value: number;
}

export interface State {
  populationSize: number;
  mutationRate: number;
  timeForSnakeToLive: number;
  moveTowardsScore: number;
  moveAwayFromScore: number;
  eatFoodScore: number;
  gridSize: number;
  displaySize: number;
  lengthOfTick: number;
}

export default class App extends React.Component<
  {
    setStatistics: Function;
    setStart: Function;
    clear: Function;
  },
  State
> {
  private snakes = React.createRef<HTMLDivElement>();
  public manager: Manager;

  public canvases;

  constructor(props) {
    super(props);

    this.state = {
      populationSize: 50,
      mutationRate: 0.1,
      timeForSnakeToLive: 30,
      moveTowardsScore: 1.5,
      moveAwayFromScore: -0.5,
      eatFoodScore: 30,
      gridSize: 20,
      displaySize: 100,
      lengthOfTick: 1
    };
  }

  componentDidMount() {
    this.forceUpdate();
  }

  updateStatistics = statistics => {
    this.props.setStatistics(statistics);
  };

  componentDidUpdate() {
    // console.log(this.canvases);
    this.props.clear();
    this.manager = new Manager({ state: this.state, canvases: this.canvases.map(canvas => canvas.current), updateStatistics: this.updateStatistics });
  }

  render() {
    this.canvases = [...Array(this.state.populationSize)].map((_, i) => React.createRef());
    return (
      <div className={"app"}>
        <Info />
        <div className={"content"}>
          <div className={"sidebar"}>
            <div className={"sidebarHeader"}>
              <h2>Snaike 🐍</h2>
              <p>
                Snaike is a browser trained snake neural network that learns to play snake. Created by <a href={"https://dries.io"}>Dries Croons</a>.
              </p>
            </div>
            <Statistics />
            <Formik
              initialValues={{
                populationSize: this.state.populationSize,
                mutationRate: this.state.mutationRate,
                timeForSnakeToLive: this.state.timeForSnakeToLive,
                moveTowardsScore: this.state.moveTowardsScore,
                moveAwayFromScore: this.state.moveAwayFromScore,
                eatFoodScore: this.state.eatFoodScore,
                gridSize: this.state.gridSize,
                displaySize: this.state.displaySize,
                lengthOfTick: this.state.lengthOfTick
              }}
              validationSchema={Yup.object().shape({
                populationSize: Yup.number().required("this field is required"),
                mutationRate: Yup.number().required("this field is required"),
                timeForSnakeToLive: Yup.number().required("this field is required"),
                moveTowardsScore: Yup.number().required("this field is required"),
                moveAwayFromScore: Yup.number().required("this field is required"),
                eatFoodScore: Yup.number().required("this field is required"),
                gridSize: Yup.number().required("this field is required"),
                displaySize: Yup.number().required("this field is required"),
                lengthOfTick: Yup.number().required("this field is required")
              })}
              onSubmit={(values: State, actions: FormikActions<State>) => {
                this.setState(values);
                actions.setSubmitting(false);
              }}
              render={(formikBag: FormikProps<State>) => (
                <Form className={"form"}>
                  <div className="formGroup">
                    <button type="submit" disabled={formikBag.isSubmitting} className={"success"}>
                      Start
                    </button>
                  </div>
                  <div className="formGroup">
                    <button type="button" onClick={() => this.manager.stop()} disabled={formikBag.isSubmitting} className={"info"}>
                      Stop
                    </button>
                  </div>
                  {Object.keys(this.state).map(state => (
                    <Field
                      name={state}
                      value={(state as any).value}
                      render={({ field, form }: FieldProps<State>) => <FormField field={field} form={form} label={fieldDescriptions[state].label} description={fieldDescriptions[state].description} />}
                    />
                  ))}
                </Form>
              )}
            />
          </div>
          <div className={"main"}>
            <div className={"mainWrapper"}>
              <div className={"snakes"} ref={this.snakes}>
                {this.canvases.map(ref => (
                  <canvas className={"canvas"} width={Manager.state.displaySize} height={Manager.state.displaySize} ref={ref} />
                ))}
              </div>{" "}
            </div>
          </div>
        </div>
        <Help />
      </div>
    );
  }
}

const mapDispatchToProps = {
  setStatistics: actions.setStatistics,
  setStart: actions.setStart,
  clear: actions.clear
};

const Snaike = connect(
  null,
  mapDispatchToProps
)(App);

ReactDOM.render(
  <Provider store={store}>
    <Snaike />
  </Provider>,
  document.getElementById("root")
);
