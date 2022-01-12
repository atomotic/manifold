import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import lh from "helpers/linkHandler";
import classNames from "classnames";
import { withRouter } from "react-router-dom";
import { Droppable } from "react-beautiful-dnd";
import Chip from "./Chip";

class Slot extends PureComponent {
  static displayName = "Hero.Builder.ActionCallouts.Slot";

  static propTypes = {
    title: PropTypes.string.isRequired,
    attributes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    actionCallouts: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
    model: PropTypes.object.isRequired,
    actionCalloutEditRoute: PropTypes.string.isRequired,
    actionCalloutNewRoute: PropTypes.string.isRequired
  };

  get title() {
    return this.props.title;
  }

  get history() {
    return this.props.history;
  }

  get attributes() {
    return this.props.attributes;
  }

  get model() {
    return this.props.model;
  }

  get actionCallouts() {
    return this.props.actionCallouts;
  }

  openNewDrawer = () => {
    const { actionCalloutNewRoute } = this.props;
    const attributes = this.attributes;
    const actionCallout = { attributes };
    return this.props.history.push(
      lh.link(actionCalloutNewRoute, this.model.id),
      { noScroll: true, actionCallout }
    );
  };

  render() {
    return (
      <Droppable droppableId={this.props.id} type="actionCallout">
        {(provided, snapshot) => (
          <div
            className={classNames("action-callout-slot", {
              "action-callout-slot--active": snapshot.isDraggingOver
            })}
          >
            <div className="action-callout-slot__content">
              <button
                type="button"
                onClick={this.openNewDrawer}
                className="action-callout-slot__button action-callout-slot__button--header"
              >
                <Utility.IconComposer icon="circlePlus32" size={32} />
                <span>
                  {this.title}
                  <br />
                  {this.attributes.button ? "buttons" : "links"}
                </span>
              </button>
              <div
                ref={provided.innerRef}
                className="action-callout-slot__chips"
              >
                {this.actionCallouts.map((actionCallout, index) => (
                  <Chip
                    key={actionCallout.id}
                    actionCalloutEditRoute={this.props.actionCalloutEditRoute}
                    index={index}
                    actionCallout={actionCallout}
                    history={this.history}
                    model={this.model}
                  />
                ))}
                {provided.placeholder}
              </div>
            </div>
          </div>
        )}
      </Droppable>
    );
  }
}

export default withRouter(Slot);