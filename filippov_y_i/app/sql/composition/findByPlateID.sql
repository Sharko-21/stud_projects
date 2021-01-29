SELECT
    composition.*
FROM
    composition
INNER JOIN
    composition_ensemble_plate
ON
    composition.id = composition_ensemble_plate.composition_id
WHERE  composition_ensemble_plate.plate_id = ${id};