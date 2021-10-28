import React from "react";
import PropTypes from "prop-types";
import findKey from "lodash/findKey";
import { readingGroupsAPI, collectingAPI, requests } from "api";
import { entityStoreActions } from "actions";
import CategoryCreator from "./CategoryCreator";
import SortableCategories from "./SortableCategories";
import CategoriesList from "./SortableCategories/CategoriesList";
import { getEntityCollection } from "frontend/components/collecting/helpers";

import withScreenReaderStatus from "hoc/with-screen-reader-status";

const { request } = entityStoreActions;

function CollectionEditor({
  readingGroup,
  categories,
  responses,
  refresh,
  dispatch,
  setScreenReaderStatus: announce
}) {
  const collection = getEntityCollection(readingGroup);

  function createCategory(attributes) {
    const call = readingGroupsAPI.createCategory(readingGroup.id, {
      attributes
    });
    const createRequest = request(call, requests.feReadingGroupCategoryCreate);
    dispatch(createRequest).promise.then(() => refresh());
  }

  function updateCategory(category) {
    const { id: categoryId, position } = category;
    const changes = { attributes: { position } };
    const call = readingGroupsAPI.updateCategory(
      readingGroup.id,
      categoryId,
      changes
    );
    const updateRequest = request(call, requests.feReadingGroupCategoryUpdate);
    dispatch(updateRequest).promise.then(() => refresh());
  }

  function removeCategory(category) {
    const call = readingGroupsAPI.destroyCategory(readingGroup.id, category.id);
    const destroyRequest = request(
      call,
      requests.feReadingGroupCategoryDestroy
    );
    dispatch(destroyRequest).promise.then(() => refresh());
  }

  function updateCollectable(collectable) {
    const call = collectingAPI.collect([collectable], readingGroup);
    const updateRequest = request(call, requests.feCollectCollectable);
    dispatch(updateRequest).promise.then(() => refresh());
  }

  function removeCollectable(collectable) {
    const call = collectingAPI.remove([collectable], readingGroup);
    const updateRequest = request(call, requests.feCollectCollectable);
    dispatch(updateRequest).promise.then(() => refresh());
  }

  function determineMovePosition(destinationId, type, direction) {
    if (direction === "down") return 1;
    const destinationCollectables =
      collection.attributes.categoryMappings[destinationId][type];
    return destinationCollectables?.length + 1 || 1;
  }

  function handleCollectableMove({ id, type, direction }) {
    const mappings = collection.attributes.categoryMappings;
    const sourceId = findKey(mappings, category =>
      category[type]?.includes(id)
    );
    // get array of IDs and move '$uncategorized$' to end to reflect UI order
    const sortedCategories = [
      ...Object.keys(mappings).slice(1),
      Object.keys(mappings)[0]
    ];
    const sourceIndex = sortedCategories.indexOf(sourceId);

    if (sourceIndex === sortedCategories.length - 1 && direction === "down") {
      announce("Cannot move down. Item is already in the last category.");
      return;
    }
    if (sourceIndex === 0 && direction === "up") {
      announce("Cannot move up. Item is already in the first category.");
      return;
    }

    const destinationId =
      direction === "down"
        ? sortedCategories[sourceIndex + 1]
        : sortedCategories[sourceIndex - 1];
    const destination = collection.attributes.categories.find(
      c => c.id === destinationId
    );
    const position = determineMovePosition(destinationId, type, direction);

    const updatedCollectable = {
      groupingId: destinationId,
      id,
      position,
      type
    };
    updateCollectable(updatedCollectable);
    announce(
      `Item moved to category “${destination?.title.plaintext ||
        "Uncategorized"}”`
    );
  }

  const callbacks = {
    onCategoryEdit: refresh,
    onCategoryDrag: updateCategory,
    onCategoryRemove: removeCategory,
    onCollectableDrag: updateCollectable,
    onCollectableRemove: removeCollectable,
    onCollectableMove: handleCollectableMove
  };

  return (
    <div className="group-collection-editor">
      <CategoryCreator onSubmit={createCategory} />
      <SortableCategories
        collection={collection}
        responses={responses}
        callbacks={callbacks}
      >
        {(categoryOrder, mappings, activeType) => (
          <CategoriesList
            groupId={readingGroup.id}
            categories={categories}
            categoryOrder={categoryOrder}
            mappings={mappings}
            responses={responses}
            callbacks={callbacks}
            activeType={activeType}
          />
        )}
      </SortableCategories>
    </div>
  );
}

CollectionEditor.displayName = "ReadingGroup.Collecting.CollectionEditor";

CollectionEditor.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  responses: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired
};

export default withScreenReaderStatus(CollectionEditor);