SELECT
    *,
    'composition' AS query_type
FROM
    composition
WHERE
    name ILIKE '%'|| ${name} || '%'