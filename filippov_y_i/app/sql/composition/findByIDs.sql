SELECT
   *
FROM
    composition
WHERE
    composition.id IN (${ids});
