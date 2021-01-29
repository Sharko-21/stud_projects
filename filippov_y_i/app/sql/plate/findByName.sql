SELECT
    DISTINCT plate.id, plate.name, plate.description, plate.date, plate.produced_by, plate.wholesaler, plate.wholesale_price,
    plate.retail_price, composition_ensemble_plate.ensemble_id,
    array_agg(DISTINCT composition.name) AS composition_name,
    array_agg(DISTINCT composition.id) AS composition_ids,
    'plate' AS query_type,
    COUNT(plate_sale.plate_id) as sold_count
FROM
    plate
LEFT JOIN
    plate_sale
ON
    plate.id = plate_sale.plate_id
LEFT JOIN
    composition_ensemble_plate
ON
    plate.id = composition_ensemble_plate.plate_id
LEFT JOIN
    composition
ON
    composition_ensemble_plate.composition_id = composition.id
WHERE
    plate.name ILIKE '%'|| ${name} || '%'
GROUP BY plate.id, plate.name, plate.description, plate.date, plate.produced_by, plate.wholesaler, plate.wholesale_price, plate.retail_price, composition_ensemble_plate.ensemble_id ORDER BY sold_count DESC;