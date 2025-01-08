import { Redirect, Route } from "react-router-dom";
import React from "react";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { barChart, swapHorizontal, wallet } from "ionicons/icons";
import { Charts, Transferts, Funds } from "./pages";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/transferts">
            <Transferts />
          </Route>
          <Route exact path="/funds">
            <Funds />
          </Route>
          <Route path="/charts">
            <Charts />
          </Route>
          <Route exact path="/">
            <Redirect to="/funds" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="transferts" href="/transferts">
            <IonIcon aria-hidden="true" icon={swapHorizontal} />
            <IonLabel>Transferts</IonLabel>
          </IonTabButton>
          <IonTabButton tab="funds" href="/funds">
            <IonIcon aria-hidden="true" icon={wallet} />
            <IonLabel>Funds</IonLabel>
          </IonTabButton>
          <IonTabButton tab="charts" href="/charts">
            <IonIcon aria-hidden="true" icon={barChart} />
            <IonLabel>Charts</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
