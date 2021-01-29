SELECT
    ensemble.id,
    ensemble.name,
    ensemble.description,
    ensemble.type,
    ARRAY_AGG(composition.id) AS composition_ids
FROM
    ensemble
LEFT JOIN
    composition
ON
    ensemble.id = composition.ensemble_id
WHERE
    ensemble.id IN (${ids})
GROUP BY ensemble.id, ensemble.name, ensemble.description, ensemble.type;
