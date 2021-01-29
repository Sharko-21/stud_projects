SELECT
    *,
    'musician' AS query_type
FROM
    musician
WHERE
    name ILIKE '%'|| ${name} || '%'