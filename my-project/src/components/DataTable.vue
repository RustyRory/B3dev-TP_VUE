<script setup>
// rien pour l'instant
</script>

<template>
  <div>
    <table>
        <h1>
            DataTable
        </h1>
        <caption>Tableau d'exemple avec en-tête, corps et pied de page</caption>
        <thead>
            <tr>
            <th scope="col">Nom</th>
            <th scope="col">Principal intérêt</th>
            <th scope="col">Âge</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <th scope="row">Chris</th>
            <td>Tables HTML</td>
            <td>22</td>
            </tr>
            <tr>
            <th scope="row">Dennis</th>
            <td>Accessibilité web</td>
            <td>45</td>
            </tr>
            <tr>
            <th scope="row">Sarah</th>
            <td>Frameworks JavaScript</td>
            <td>29</td>
            </tr>
            <tr>
            <th scope="row">Karen</th>
            <td>Performance web</td>
            <td>36</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
            <th scope="row" colspan="2">Âge moyen</th>
            <td>33</td>
            </tr>
        </tfoot>
    </table>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
  border: 2px solid rgb(140 140 140);
  font-family: sans-serif;
  font-size: 0.8rem;
  letter-spacing: 1px;
}

caption {
  caption-side: bottom;
  padding: 10px;
  font-weight: bold;
}

thead,
tfoot {
  background-color: rgb(228 240 245);
}

th,
td {
  border: 1px solid rgb(160 160 160);
  padding: 8px 10px;
}

td:last-of-type {
  text-align: center;
}

tbody > tr:nth-of-type(even) {
  background-color: rgb(237 238 242);
}

tfoot th {
  text-align: right;
}

tfoot td {
  font-weight: bold;
}
</style>

