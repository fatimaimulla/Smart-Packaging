import { selectBestFefcoForBundle } from "./fefco.js";

const FRAGILITY_ORDER = {
  low: 0,
  medium: 1,
  high: 2,
};

const FRAGILITY_PADDING = {
  low: 2,
  medium: 5,
  high: 10,
};

const MAX_LAYER_COUNT = 3;

const roundDimension = (value) => Number(value.toFixed(2));

const buildOrientationOptions = (dimensions) => {
  const values = [dimensions.l, dimensions.w, dimensions.h];
  const seen = new Set();

  return values
    .map((heightValue, index) => {
      const base = values.filter((_, innerIndex) => innerIndex !== index);
      const [l, w] = [...base].sort((left, right) => right - left);
      return {
        l,
        w,
        h: heightValue,
      };
    })
    .filter((option) => {
      const key = `${option.l}x${option.w}x${option.h}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
};

const compareByPackingPriority = (left, right) => {
  const fragilityDelta =
    FRAGILITY_ORDER[left.fragility] - FRAGILITY_ORDER[right.fragility];
  if (fragilityDelta !== 0) {
    return fragilityDelta;
  }

  const leftFootprint = left.paddedDimensions.l * left.paddedDimensions.w;
  const rightFootprint = right.paddedDimensions.l * right.paddedDimensions.w;
  if (leftFootprint !== rightFootprint) {
    return rightFootprint - leftFootprint;
  }

  const leftVolume =
    left.paddedDimensions.l * left.paddedDimensions.w * left.paddedDimensions.h;
  const rightVolume =
    right.paddedDimensions.l * right.paddedDimensions.w * right.paddedDimensions.h;

  return rightVolume - leftVolume;
};

const buildExpandedItems = (sourceItems = []) => {
  const expanded = [];

  sourceItems.forEach((sourceItem) => {
    const padding = FRAGILITY_PADDING[sourceItem.fragility] ?? 2;
    const paddedDimensions = {
      l: sourceItem.dimensions.l + padding * 2,
      w: sourceItem.dimensions.w + padding * 2,
      h: sourceItem.dimensions.h + padding * 2,
    };
    const orientations = buildOrientationOptions(paddedDimensions);

    for (let quantityIndex = 0; quantityIndex < sourceItem.quantity; quantityIndex += 1) {
      expanded.push({
        itemId: `${sourceItem.sessionId}-${quantityIndex + 1}`,
        sourceSessionId: sourceItem.sessionId,
        name: sourceItem.name,
        image1: sourceItem.image1 || null,
        fragility: sourceItem.fragility,
        weightGrams: sourceItem.productWeightGrams,
        quantityIndex: quantityIndex + 1,
        baseDimensions: sourceItem.dimensions,
        paddedDimensions,
        paddingMm: padding,
        orientations,
      });
    }
  });

  return expanded.sort(compareByPackingPriority);
};

const createPlacement = (item, orientation, position, layerIndex) => ({
  itemId: item.itemId,
  sourceSessionId: item.sourceSessionId,
  name: item.name,
  image1: item.image1,
  fragility: item.fragility,
  weightGrams: item.weightGrams,
  quantityIndex: item.quantityIndex,
  paddingMm: item.paddingMm,
  originalDimensions: item.baseDimensions,
  paddedDimensions: orientation,
  position: {
    x: roundDimension(position.x),
    y: roundDimension(position.y),
    z: roundDimension(position.z),
  },
  layerIndex,
});

const layoutRow = (items, layerIndex, zOffset) => {
  let cursorX = 0;
  let maxWidth = 0;
  let maxHeight = 0;

  const placements = items.map(({ item, orientation }) => {
    const placement = createPlacement(
      item,
      orientation,
      { x: cursorX, y: 0, z: zOffset },
      layerIndex,
    );
    cursorX += orientation.l;
    maxWidth = Math.max(maxWidth, orientation.w);
    maxHeight = Math.max(maxHeight, orientation.h);
    return placement;
  });

  return {
    layoutType: "row",
    placements,
    dimensions: {
      l: roundDimension(cursorX),
      w: roundDimension(maxWidth),
      h: roundDimension(maxHeight),
    },
  };
};

const layoutColumn = (items, layerIndex, zOffset) => {
  let cursorY = 0;
  let maxLength = 0;
  let maxHeight = 0;

  const placements = items.map(({ item, orientation }) => {
    const placement = createPlacement(
      item,
      orientation,
      { x: 0, y: cursorY, z: zOffset },
      layerIndex,
    );
    cursorY += orientation.w;
    maxLength = Math.max(maxLength, orientation.l);
    maxHeight = Math.max(maxHeight, orientation.h);
    return placement;
  });

  return {
    layoutType: "column",
    placements,
    dimensions: {
      l: roundDimension(maxLength),
      w: roundDimension(cursorY),
      h: roundDimension(maxHeight),
    },
  };
};

const layoutShelves = (items, layerIndex, zOffset) => {
  const totalArea = items.reduce(
    (sum, entry) => sum + entry.orientation.l * entry.orientation.w,
    0,
  );
  const maxLength = Math.max(...items.map((entry) => entry.orientation.l));
  const candidates = Array.from(
    new Set([
      maxLength,
      roundDimension(Math.sqrt(totalArea)),
      roundDimension(Math.sqrt(totalArea) * 1.15),
      ...items.map((entry) => entry.orientation.l),
    ]),
  )
    .filter((value) => value >= maxLength)
    .sort((left, right) => left - right);

  let best = null;

  candidates.forEach((targetLength) => {
    let cursorX = 0;
    let cursorY = 0;
    let shelfWidth = 0;
    let usedLength = 0;
    let maxHeight = 0;
    const placements = [];

    items.forEach(({ item, orientation }) => {
      if (cursorX > 0 && cursorX + orientation.l > targetLength) {
        cursorY += shelfWidth;
        cursorX = 0;
        shelfWidth = 0;
      }

      placements.push(
        createPlacement(
          item,
          orientation,
          { x: cursorX, y: cursorY, z: zOffset },
          layerIndex,
        ),
      );

      cursorX += orientation.l;
      usedLength = Math.max(usedLength, cursorX);
      shelfWidth = Math.max(shelfWidth, orientation.w);
      maxHeight = Math.max(maxHeight, orientation.h);
    });

    const totalWidth = cursorY + shelfWidth;
    const dimensions = {
      l: roundDimension(usedLength),
      w: roundDimension(totalWidth),
      h: roundDimension(maxHeight),
    };
    const footprintArea = dimensions.l * dimensions.w;

    if (
      !best ||
      footprintArea < best.footprintArea ||
      (footprintArea === best.footprintArea && dimensions.w < best.dimensions.w)
    ) {
      best = {
        layoutType: "shelf",
        placements,
        dimensions,
        footprintArea,
      };
    }
  });

  return {
    layoutType: best.layoutType,
    placements: best.placements,
    dimensions: best.dimensions,
  };
};

const buildLayerLayout = (items, arrangement, layerIndex, zOffset) => {
  switch (arrangement) {
    case "column":
      return layoutColumn(items, layerIndex, zOffset);
    case "shelf":
      return layoutShelves(items, layerIndex, zOffset);
    default:
      return layoutRow(items, layerIndex, zOffset);
  }
};

const generateArrangementCombos = (layerCount) => {
  const arrangements = ["row", "column", "shelf"];
  const combos = [];

  const walk = (depth, current) => {
    if (depth === layerCount) {
      combos.push([...current]);
      return;
    }

    arrangements.forEach((arrangement) => {
      current.push(arrangement);
      walk(depth + 1, current);
      current.pop();
    });
  };

  walk(0, []);
  return combos;
};

const generatePartitions = (itemCount, layerCount) => {
  const partitions = [];

  const walk = (remaining, slots, current) => {
    if (slots === 1) {
      partitions.push([...current, remaining]);
      return;
    }

    const minValue = 1;
    const maxValue = remaining - (slots - 1);
    for (let value = minValue; value <= maxValue; value += 1) {
      current.push(value);
      walk(remaining - value, slots - 1, current);
      current.pop();
    }
  };

  walk(itemCount, layerCount, []);
  return partitions;
};

const getOverallFragility = (items) =>
  items.reduce((current, item) => {
    if (FRAGILITY_ORDER[item.fragility] > FRAGILITY_ORDER[current]) {
      return item.fragility;
    }
    return current;
  }, "low");

const validateCandidate = (layers, overallFragility) => {
  for (let index = 1; index < layers.length; index += 1) {
    const current = layers[index];
    const below = layers[index - 1];

    if (
      current.dimensions.l > below.dimensions.l + 0.01 ||
      current.dimensions.w > below.dimensions.w + 0.01
    ) {
      return { valid: false, reason: "Unstable base footprint." };
    }
  }

  if (overallFragility === "high") {
    const topLayerIndex = layers.length - 1;
    const hasHighBelowTop = layers.some(
      (layer, layerIndex) =>
        layerIndex !== topLayerIndex &&
        layer.items.some((entry) => entry.item.fragility === "high"),
    );

    if (hasHighBelowTop) {
      return { valid: false, reason: "High fragility items are not on the top layer." };
    }
  }

  return { valid: true };
};

const calculateStructuralMetrics = (dimensions, layers, totalWeightGrams) => {
  const footprintLong = Math.max(dimensions.l, dimensions.w);
  const footprintShort = Math.max(1, Math.min(dimensions.l, dimensions.w));
  const maxDimension = Math.max(dimensions.l, dimensions.w, dimensions.h);
  const minDimension = Math.max(1, Math.min(dimensions.l, dimensions.w, dimensions.h));
  const footprintRatio = footprintLong / footprintShort;
  const overallRatio = maxDimension / minDimension;
  const towerRatio = dimensions.h / footprintShort;
  const maxLayerCoverage = layers.reduce((currentMax, layer, index) => {
    if (index === 0) {
      return currentMax;
    }

    const below = layers[index - 1];
    const coverage =
      (layer.dimensions.l * layer.dimensions.w) /
      Math.max(1, below.dimensions.l * below.dimensions.w);
    return Math.max(currentMax, coverage);
  }, 0);

  return {
    footprintRatio: Number(footprintRatio.toFixed(3)),
    overallRatio: Number(overallRatio.toFixed(3)),
    towerRatio: Number(towerRatio.toFixed(3)),
    maxDimension: Number(maxDimension.toFixed(2)),
    minDimension: Number(minDimension.toFixed(2)),
    baseArea: Number((dimensions.l * dimensions.w).toFixed(2)),
    maxLayerCoverage: Number(maxLayerCoverage.toFixed(3)),
    layerCount: layers.length,
    totalWeightGrams,
  };
};

const calculateStructuralPenalty = (dimensions, metrics, layoutFamily) => {
  const rawVolume = dimensions.l * dimensions.w * dimensions.h;
  const aspectRatioPenalty =
    rawVolume * Math.max(0, metrics.footprintRatio - 2.4) * 0.18;
  const overallRatioPenalty =
    rawVolume * Math.max(0, metrics.overallRatio - 3.2) * 0.12;
  const maxDimensionPenalty =
    rawVolume * Math.max(0, (metrics.maxDimension - 420) / 420) * 0.08;
  const towerPenalty =
    rawVolume * Math.max(0, metrics.towerRatio - 1.1) * 0.08;
  const supportPenalty =
    rawVolume * Math.max(0, metrics.maxLayerCoverage - 0.78) * 0.06;
  const handlingPenalty =
    layoutFamily === "row"
      ? rawVolume * Math.max(0, metrics.footprintRatio - 3.2) * 0.05
      : 0;

  const totalPenalty =
    aspectRatioPenalty +
    overallRatioPenalty +
    maxDimensionPenalty +
    towerPenalty +
    supportPenalty +
    handlingPenalty;

  return {
    rawVolume: Number(rawVolume.toFixed(2)),
    aspectRatioPenalty: Number(aspectRatioPenalty.toFixed(2)),
    overallRatioPenalty: Number(overallRatioPenalty.toFixed(2)),
    maxDimensionPenalty: Number(maxDimensionPenalty.toFixed(2)),
    towerPenalty: Number(towerPenalty.toFixed(2)),
    supportPenalty: Number(supportPenalty.toFixed(2)),
    handlingPenalty: Number(handlingPenalty.toFixed(2)),
    structuralPenalty: Number(totalPenalty.toFixed(2)),
    effectiveVolume: Number((rawVolume + totalPenalty).toFixed(2)),
  };
};

const scoreCandidate = (candidate) => ({
  effectiveVolume: candidate.scoreBreakdown.effectiveVolume,
  structuralPenalty: candidate.scoreBreakdown.structuralPenalty,
  fefcoSelectionScore: candidate.scoreBreakdown.fefcoSelectionScore,
  boardArea: candidate.boardArea,
  layerCount: candidate.layers.length,
});

const isBetterCandidate = (nextCandidate, currentBest) => {
  if (!currentBest) {
    return true;
  }

  const nextScore = scoreCandidate(nextCandidate);
  const currentScore = scoreCandidate(currentBest);

  if (nextScore.effectiveVolume !== currentScore.effectiveVolume) {
    return nextScore.effectiveVolume < currentScore.effectiveVolume;
  }

  if (nextScore.structuralPenalty !== currentScore.structuralPenalty) {
    return nextScore.structuralPenalty < currentScore.structuralPenalty;
  }

  if (nextScore.fefcoSelectionScore !== currentScore.fefcoSelectionScore) {
    return nextScore.fefcoSelectionScore < currentScore.fefcoSelectionScore;
  }

  if (nextScore.boardArea !== currentScore.boardArea) {
    return nextScore.boardArea < currentScore.boardArea;
  }

  return nextScore.layerCount < currentScore.layerCount;
};

const finalizeCandidate = (layers, layoutFamily, sourceItems) => {
  const totalHeight = layers.reduce((sum, layer) => sum + layer.dimensions.h, 0);
  const maxLength = Math.max(...layers.map((layer) => layer.dimensions.l));
  const maxWidth = Math.max(...layers.map((layer) => layer.dimensions.w));
  const dimensions = {
    l: roundDimension(maxLength),
    w: roundDimension(maxWidth),
    h: roundDimension(totalHeight),
  };
  const totalWeightGrams = sourceItems.reduce(
    (sum, item) => sum + item.productWeightGrams * item.quantity,
    0,
  );
  const overallFragility = getOverallFragility(
    sourceItems.flatMap((item) =>
      Array.from({ length: item.quantity }, () => ({ fragility: item.fragility })),
    ),
  );
  const structuralMetrics = calculateStructuralMetrics(
    dimensions,
    layers,
    totalWeightGrams,
  );
  const template = selectBestFefcoForBundle(
    dimensions,
    overallFragility,
    structuralMetrics,
  );
  const scoreBreakdown = calculateStructuralPenalty(
    dimensions,
    structuralMetrics,
    layoutFamily,
  );
  const placements = layers.flatMap((layer) => layer.placements);

  return {
    dimensions,
    selectedTemplateId: template.selectedTemplateId,
    fefcoCode: template.fefcoCode,
    totalWeightGrams,
    overallFragility,
    layoutFamily,
    layers: layers.map((layer, index) => ({
      index,
      layoutType: layer.layoutType,
      dimensions: layer.dimensions,
      itemCount: layer.items.length,
      items: layer.items.map((entry) => ({
        itemId: entry.item.itemId,
        sourceSessionId: entry.item.sourceSessionId,
        name: entry.item.name,
        quantityIndex: entry.item.quantityIndex,
        fragility: entry.item.fragility,
      })),
    })),
    placements,
    boardArea: roundDimension(template.boardArea),
    structuralMetrics,
    scoreBreakdown: {
      ...scoreBreakdown,
      fefcoSuitabilityPenalty: template.suitabilityPenalty,
      fefcoSelectionScore: template.selectionScore,
    },
  };
};

const buildCandidateFromLayers = (layerGroups, arrangements, layoutFamily, sourceItems) => {
  const layers = [];
  let zOffset = 0;

  for (let index = 0; index < layerGroups.length; index += 1) {
    const layerLayout = buildLayerLayout(
      layerGroups[index],
      arrangements[index],
      index,
      zOffset,
    );

    layers.push({
      ...layerLayout,
      items: layerGroups[index],
    });
    zOffset += layerLayout.dimensions.h;
  }

  const overallFragility = getOverallFragility(
    layerGroups.flatMap((group) => group.map((entry) => ({ fragility: entry.item.fragility }))),
  );
  const validation = validateCandidate(layers, overallFragility);

  if (!validation.valid) {
    return null;
  }

  return finalizeCandidate(layers, layoutFamily, sourceItems);
};

const buildBalancedPartition = (items, layerCount) => {
  const sizes = [];
  const baseSize = Math.floor(items.length / layerCount);
  let remainder = items.length % layerCount;

  for (let index = 0; index < layerCount; index += 1) {
    const nextSize = baseSize + (remainder > 0 ? 1 : 0);
    sizes.push(nextSize);
    remainder -= 1;
  }

  const groups = [];
  let cursor = 0;
  sizes.forEach((size) => {
    if (size > 0) {
      groups.push(items.slice(cursor, cursor + size));
      cursor += size;
    }
  });
  return groups;
};

const applyOrientationPolicy = (items, policy) =>
  items.map((item) => {
    const sorted = [...item.orientations].sort((left, right) => {
      const leftFootprint = left.l * left.w;
      const rightFootprint = right.l * right.w;

      if (policy === "tall") {
        if (leftFootprint !== rightFootprint) {
          return leftFootprint - rightFootprint;
        }
        return right.h - left.h;
      }

      if (policy === "balanced") {
        const leftMax = Math.max(left.l, left.w, left.h);
        const rightMax = Math.max(right.l, right.w, right.h);
        if (leftMax !== rightMax) {
          return leftMax - rightMax;
        }
        return leftFootprint - rightFootprint;
      }

      if (left.h !== right.h) {
        return left.h - right.h;
      }

      return leftFootprint - rightFootprint;
    });

    return {
      item,
      orientation: sorted[0],
    };
  });

const evaluateExactCandidates = (expandedItems, sourceItems) => {
  const partitions = [];
  const maxLayers = Math.min(MAX_LAYER_COUNT, expandedItems.length);

  for (let layerCount = 1; layerCount <= maxLayers; layerCount += 1) {
    partitions.push(...generatePartitions(expandedItems.length, layerCount));
  }

  let bestCandidate = null;
  const orientedEntries = new Array(expandedItems.length);

  const walkOrientations = (index) => {
    if (index === expandedItems.length) {
      partitions.forEach((partitionSizes) => {
        const groups = [];
        let cursor = 0;

        partitionSizes.forEach((size) => {
          groups.push(orientedEntries.slice(cursor, cursor + size));
          cursor += size;
        });

        const arrangements = generateArrangementCombos(groups.length);
        arrangements.forEach((combo) => {
          const layoutFamily = groups.length > 1 ? "tiered-layers" : combo[0];
          const candidate = buildCandidateFromLayers(
            groups,
            combo,
            layoutFamily,
            sourceItems,
          );

          if (candidate && isBetterCandidate(candidate, bestCandidate)) {
            bestCandidate = candidate;
          }
        });
      });

      return;
    }

    expandedItems[index].orientations.forEach((orientation) => {
      orientedEntries[index] = {
        item: expandedItems[index],
        orientation,
      };
      walkOrientations(index + 1);
    });
  };

  walkOrientations(0);
  return bestCandidate;
};

const buildHeuristicCandidates = (expandedItems, sourceItems) => {
  const policies = ["flat", "balanced", "tall"];
  const candidates = [];

  policies.forEach((policy) => {
    const oriented = applyOrientationPolicy(expandedItems, policy);

    candidates.push(
      buildCandidateFromLayers(
        [oriented],
        ["shelf"],
        "single-layer-shelves",
        sourceItems,
      ),
    );

    const tieredGroups = ["low", "medium", "high"]
      .map((fragility) =>
        oriented.filter((entry) => entry.item.fragility === fragility),
      )
      .filter((group) => group.length > 0);

    if (tieredGroups.length > 0) {
      candidates.push(
        buildCandidateFromLayers(
          tieredGroups,
          tieredGroups.map(() => "shelf"),
          "tiered-layers",
          sourceItems,
        ),
      );
    }

    const layerCount = expandedItems.length > 14 ? 3 : 2;
    const compactGroups = buildBalancedPartition(oriented, layerCount);
    candidates.push(
      buildCandidateFromLayers(
        compactGroups,
        compactGroups.map(() => "shelf"),
        "compact-mixed-shelves",
        sourceItems,
      ),
    );
  });

  return candidates.filter(Boolean).sort((left, right) => {
    if (
      left.scoreBreakdown.effectiveVolume !==
      right.scoreBreakdown.effectiveVolume
    ) {
      return (
        left.scoreBreakdown.effectiveVolume -
        right.scoreBreakdown.effectiveVolume
      );
    }

    if (
      left.scoreBreakdown.fefcoSelectionScore !==
      right.scoreBreakdown.fefcoSelectionScore
    ) {
      return (
        left.scoreBreakdown.fefcoSelectionScore -
        right.scoreBreakdown.fefcoSelectionScore
      );
    }

    if (left.boardArea !== right.boardArea) {
      return left.boardArea - right.boardArea;
    }

    return left.layers.length - right.layers.length;
  });
};

export const optimizeBundleLayout = (sourceItems, optimizerMode = "hybrid-v1") => {
  if (optimizerMode !== "hybrid-v1") {
    throw new Error("Unsupported optimizer mode.");
  }

  const totalUnits = sourceItems.reduce((sum, item) => sum + item.quantity, 0);
  if (totalUnits <= 0) {
    throw new Error("At least one product quantity is required.");
  }

  if (totalUnits > 20) {
    throw new Error("Bundle optimization supports at most 20 total units.");
  }

  const expandedItems = buildExpandedItems(sourceItems);

  const candidate =
    totalUnits <= 6
      ? evaluateExactCandidates(expandedItems, sourceItems)
      : buildHeuristicCandidates(expandedItems, sourceItems)[0];

  if (!candidate) {
    throw new Error("Unable to find a valid bundle layout for the selected products.");
  }

  return candidate;
};
