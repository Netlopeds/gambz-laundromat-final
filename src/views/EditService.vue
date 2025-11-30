<template>
  <div class="edit-service-page">

    <!-- Toggle Buttons -->
    <div class="toggle-container">
      <button
        class="toggle-btn"
        :class="{ active: activeTab === 'service' }"
        @click="activeTab = 'service'"
      >
        SERVICE
      </button>

      <button
        class="toggle-btn"
        :class="{ active: activeTab === 'addons' }"
        @click="activeTab = 'addons'"
      >
        ADD-ONS
      </button>
    </div>

    <!-- Table Container -->
    <div class="service-table-card">
      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Price</th>
            <th>Last Updated</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in displayedItems" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.price }}</td>
            <td>{{ item.lastUpdated }}</td>
            <td>
              <button class="edit-btn">
                <i class="fas fa-pen"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: "service",

      services: [
        { id: 1, name: "Wash", price: 60, lastUpdated: "" },
        { id: 2, name: "Dry", price: 60, lastUpdated: "" },
        { id: 3, name: "Fold", price: 30, lastUpdated: "" },
        { id: 4, name: "Spin", price: 15, lastUpdated: "" },
      ],

      addons: [
        { id: 1, name: "Fabric Conditioner", price: 10, lastUpdated: "" },
        { id: 2, name: "Bleach", price: 15, lastUpdated: "" },
      ]
    };
  },

  computed: {
    displayedItems() {
      return this.activeTab === "service" ? this.services : this.addons;
    }
  }
};
</script>
