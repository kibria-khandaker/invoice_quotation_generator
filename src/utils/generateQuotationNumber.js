import AsyncStorage from '@react-native-async-storage/async-storage';

export const generateQuotationNumber = async () => {
  try {
    const now = new Date();

    // DATE PARTS
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);

    // DAILY KEY (RESET SYSTEM)
    const dateKey = `${now.getFullYear()}-${month}-${day}`;
    const storageKey = `QUOTE_COUNTER_${dateKey}`;

    // GET COUNTER
    let count = await AsyncStorage.getItem(storageKey);

    if (!count) {
      count = 1001;
    } else {
      count = parseInt(count) + 1;
    }

    // SAVE BACK
    await AsyncStorage.setItem(storageKey, count.toString());

    // FORMAT
    const serial = String(count);

    return `${day}${month}${year}Q${serial}`;

  } catch (error) {
    console.log('Quotation Number Error:', error);

    // fallback safe value
    return `QTN-${Date.now()}`;
  }
};