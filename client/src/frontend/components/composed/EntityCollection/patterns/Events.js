import React from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import Event from "frontend/components/event";
import EntityCollection from "../EntityCollection";
import * as shapes from "../shapes";

function EventsEntityCollection({
  events,
  eventsMeta,
  paginationProps,
  ...passThroughProps
}) {
  const showPagination = !isEmpty(eventsMeta) && !isEmpty(paginationProps);
  return (
    <EntityCollection
      title="All Activity"
      icon="recentActivity64"
      BodyComponent={props => <Event.List events={events} {...props} />}
      paginationProps={
        !showPagination
          ? {}
          : {
              pagination: get(eventsMeta, "pagination"),
              ...paginationProps
            }
      }
      {...passThroughProps}
    />
  );
}

EventsEntityCollection.displayName =
  "Frontend.Composed.EntityCollection.Events";

EventsEntityCollection.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  eventsMeta: PropTypes.object,
  paginationProps: shapes.pagination
};

export default EventsEntityCollection;