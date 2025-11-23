import { type HistoryData, type HistoryDataItem } from "@/constants/types";
import { useThemedColors } from "@/hooks/useThemedColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";
import { memo, useCallback, useMemo, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { runOnJS, runOnUI, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const TOTAL_ITEM_HEIGHT = 96;
const SWIPE_THRESHOLD = -150;

const SwipeableListItemComponent = ({
  item,
  handleDelete,
  handlePress,
}: {
  item: HistoryDataItem;
  handleDelete: () => void;
  handlePress: () => void;
}) => {
  const colors = useThemedColors();
  const { width: windowWidth } = useWindowDimensions();
  const isAnimating = useSharedValue<boolean>(false);
  const translateX = useSharedValue<number>(0);

  const showConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Delete item", "Are you sure you want to delete this item?", [
      {
        text: "Yes",
        onPress: () => {
          runOnUI(() => {
            isAnimating.value = true;
            translateX.value = withSpring(-windowWidth);
          })();
          setTimeout(() => {
            runOnJS(handleDelete)();
          }, 250);
        },
        style: "destructive",
      },
      {
        text: "No",
        onPress: () => {
          runOnUI(() => {
            translateX.value = withSpring(0);
            isAnimating.value = false;
          })();
        },
        style: "cancel",
      },
    ]);
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-8, 8])
    .onUpdate((e) => {
      if (!isAnimating.value && e.translationX < 0) translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (isAnimating.value) return;
      if (e.translationX < SWIPE_THRESHOLD) {
        translateX.value = withSpring(-80);
        runOnJS(showConfirm)();
      } else translateX.value = withSpring(0);
    });

  const itemAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteActionAnimatedStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -20 ? 1 : 0,
    transform: [{ scale: translateX.value / -150 < 1 ? translateX.value / -150 : 1 }],
  }));

  return (
    <View style={{ height: TOTAL_ITEM_HEIGHT - 16, marginBottom: 16 }}>
      <Animated.View style={[styles.deleteAction, deleteActionAnimatedStyle]}>
        <MaterialCommunityIcons name="trash-can-outline" size={32} color="white" />
      </Animated.View>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={itemAnimatedStyle}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handlePress}
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.primary }]}
          >
            <View style={[styles.cardIcon, { backgroundColor: colors.primary + "20" }]}>
              <MaterialCommunityIcons name={item.type === "url" ? "web" : "text-long"} size={24} color={colors.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.cardData, { color: colors.text }]}
                allowFontScaling={false}
              >
                {item.data}
              </Text>
              <Text style={[styles.cardDateTime, { color: colors.textSecondary }]} allowFontScaling={false}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const SwipeableListItem = memo(
  SwipeableListItemComponent,
  (prev, next) =>
    prev.item.timestamp === next.item.timestamp &&
    prev.item.data === next.item.data &&
    prev.item.type === next.item.type &&
    prev.handleDelete === next.handleDelete &&
    prev.handlePress === next.handlePress
);

type Filter = "All" | "URL" | "Text";

const FilterGroup = ({ selected, onSelect }: { selected: Filter; onSelect: (s: Filter) => void }) => {
  const colors = useThemedColors();
  const FilterButton = ({ title }: { title: Filter }) => (
    <TouchableOpacity
      style={[styles.filterButton, { backgroundColor: selected === title ? colors.primary : colors.card }]}
      onPress={() => {
        Haptics.selectionAsync();
        onSelect(title);
      }}
    >
      <Text
        style={
          selected === title
            ? { color: "#fff", fontSize: 16, fontFamily: "InterSemiBold" }
            : { color: colors.text, fontSize: 16, fontFamily: "InterRegular" }
        }
        allowFontScaling={false}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
  return (
    <View style={[styles.filterContainer, { justifyContent: "space-between", marginBottom: 24 }]}>
      <Text style={[styles.filterText, { color: colors.text }]} allowFontScaling={false}>
        Filter <MaterialCommunityIcons name="filter-variant" size={styles.filterText.fontSize} color="currentColor" />
      </Text>
      <View style={styles.filterContainer}>
        <FilterButton title="All" />
        <FilterButton title="URL" />
        <FilterButton title="Text" />
      </View>
    </View>
  );
};

export default function HistoryScreen() {
  const colors = useThemedColors();
  const router = useRouter();

  const [history, setHistory] = useState<HistoryData>([]);
  const [filter, setFilter] = useState<Filter>("All");

  const filteredList = useMemo(
    () =>
      (filter === "URL"
        ? history.filter((item) => item.type === "url")
        : filter === "Text"
        ? history.filter((item) => item.type === "text")
        : history
      ).sort((a, b) => b.timestamp - a.timestamp),
    [filter, history]
  );

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("QRScanHistory")
        .then((d) => (d != null ? setHistory(JSON.parse(d)) : {}))
        .catch(console.error);
    }, [])
  );

  const deleteItem = useCallback((ts: number): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setHistory((h) => {
      const newHistory: HistoryData = h.filter((item) => item.timestamp !== ts);
      AsyncStorage.setItem("QRScanHistory", JSON.stringify(newHistory)).catch(console.error);
      return newHistory;
    });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: HistoryDataItem }) => (
      <SwipeableListItem
        item={item}
        handleDelete={() => deleteItem(item.timestamp)}
        handlePress={() => {
          const { timestamp, ...params } = item;
          router.push({ pathname: "/result", params });
        }}
      />
    ),
    [deleteItem, router]
  );

  const getItemLayout = useCallback(
    (_data: ArrayLike<HistoryDataItem> | null | undefined, index: number) => ({
      length: TOTAL_ITEM_HEIGHT,
      offset: TOTAL_ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <FilterGroup selected={filter} onSelect={setFilter} />
        <FlatList
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          data={filteredList}
          keyExtractor={(item) => item.timestamp.toString()}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          removeClippedSubviews={true}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="history" size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.text }]} allowFontScaling={false}>
                No history found
              </Text>
            </View>
          )}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  filterContainer: { flexDirection: "row", alignItems: "center", gap: 10 },
  filterText: { fontSize: 20, fontFamily: "InterSemiBold" },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    minWidth: 64,
    alignItems: "center",
  },
  container: { flex: 1, padding: 24 },
  listContainer: { flexGrow: 1 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { marginTop: 16, fontSize: 18, fontFamily: "InterMedium" },

  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 999999,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: { flex: 1, minWidth: 0 },
  cardData: { flexShrink: 1, marginBottom: 4, fontSize: 16, fontFamily: "InterSemiBold" },
  cardDateTime: { fontSize: 12, fontFamily: "InterRegular" },
  deleteAction: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    aspectRatio: 1,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#EF4444",
  },
});
