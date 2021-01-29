SELECT
    ensemble.id,
    ensemble.name,
    ensemble.description,
    ensemble.type,
    'ensemble' AS query_type
FROM
    ensemble
WHERE
    ${name} IS NOT NULL AND (ensemble.name ILIKE '%'|| ${name} || '%');