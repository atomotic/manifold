import React from "react";
import PropTypes from "prop-types";
import GridItem from "frontend/components/project-list/GridItem";
import Template from "../Template";
import DeferredCollectable from "../DeferredCollectable";

function CollectedProjects({ collectedIds, responses, onUncollect, nested }) {
  if (collectedIds.length < 1) return null;

  return (
    <Template title="Projects" icon="projects64" nested={nested}>
      <div className="project-list grid entity-section-wrapper__body group-collection-category__bottom-margin-offset">
        <ul>
          {collectedIds.map(id => (
            <li key={id} className="project-list__item--pos-rel">
              <DeferredCollectable
                id={id}
                type="projects"
                responses={responses}
              >
                {response => {
                  return (
                    <GridItem
                      authenticated={false}
                      project={response}
                      onUncollect={onUncollect}
                    />
                  );
                }}
              </DeferredCollectable>
            </li>
          ))}
        </ul>
      </div>
    </Template>
  );
}

CollectedProjects.displayName = "ReadingGroup.Collecting.CollectedProjects";

CollectedProjects.propTypes = {
  collectedIds: PropTypes.array.isRequired,
  responses: PropTypes.array.isRequired,
  onUncollect: PropTypes.func,
  nested: PropTypes.bool
};

export default CollectedProjects;