SELECT
    DISTINCT plate.*
FROM
    composition_ensemble_plate
INNER JOIN
    plate
ON
    composition_ensemble_plate.plate_id = plate.id
WHERE
    ensemble_id = ${id};